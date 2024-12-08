import { NextApiRequest, NextApiResponse } from 'next';
import { ICalCalendar, ICalEventRepeatingFreq } from 'ical-generator';

interface CourseComponent {
  courseName: string;
  component: string;
  section: string;
  days: number[]; // 0=Sunday, 1=Monday, ..., 6=Saturday
  startTime: string; // "HH:MM" or "HH:MMAM/PM"
  endTime: string;
  room: string;
  instructor: string;
  startDate: Date;
  endDate: Date;
}

function parseDays(dayStr: string): number[] {
  const dayMap: Record<string, number> = {
    'M': 1,
    'T': 2,
    'W': 3,
    'Th': 4,
    'F': 5,
    'S': 6,
    'Su': 0
  };

  let idx = 0;
  const days: number[] = [];
  while (idx < dayStr.length) {
    if (dayStr.startsWith("Th", idx)) {
      days.push(dayMap['Th']);
      idx += 2;
    } else if (dayStr.startsWith("Su", idx)) {
      days.push(dayMap['Su']);
      idx += 2;
    } else {
      const ch = dayStr[idx];
      if (dayMap[ch]) {
        days.push(dayMap[ch]);
      }
      idx++;
    }
  }

  return days;
}

function parseTimeToDate(timeStr: string, referenceDate: Date): Date {
  const upper = timeStr.toUpperCase();
  let hours: number;
  let minutes: number;

  const ampmMatch = upper.match(/(\d{1,2}):(\d{2})(AM|PM)/);
  if (ampmMatch) {
    hours = parseInt(ampmMatch[1], 10);
    minutes = parseInt(ampmMatch[2], 10);
    const ampm = ampmMatch[3];
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
  } else {
    const match24 = upper.match(/(\d{1,2}):(\d{2})/);
    if (match24) {
      hours = parseInt(match24[1], 10);
      minutes = parseInt(match24[2], 10);
    } else {
      hours = 12;
      minutes = 0;
    }
  }

  const d = new Date(referenceDate);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function parseDaysAndTimes(line: string): { days: number[], startTime: string, endTime: string } {
  if (line.toUpperCase() === "TBA") {
    return { days: [], startTime: "12:00", endTime: "12:00" };
  }

  const parts = line.split(' ', 2);
  if (parts.length < 2) {
    return { days: [], startTime: "12:00", endTime: "12:00" };
  }

  const daysPart = parts[0];
  const timePart = line.substring(daysPart.length).trim();

  const dashIndex = timePart.indexOf('-');
  if (dashIndex < 0) {
    return { days: parseDays(daysPart), startTime: "12:00", endTime: "12:00" };
  }

  const startStr = timePart.substring(0, dashIndex).trim();
  const endStr = timePart.substring(dashIndex + 1).trim();

  return {
    days: parseDays(daysPart),
    startTime: startStr,
    endTime: endStr
  };
}

function parseCourseComponents(text: string): CourseComponent[] {
  const lines = text.split('\n').map(l => l.trim());

  const courseNameLinePattern = /^[A-Z]{2,}\s+\d+[A-Z]*\s*-\s*.+$/;
  const headerPattern = /^Class Nbr\s+Section\s+Component\s+Days & Times\s+Room\s+Instructor\s+Start\/End Date$/;
  const datesPattern = /(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})/;

  let currentCourseName = "Unknown Course";
  const componentsList: CourseComponent[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (courseNameLinePattern.test(line)) {
      currentCourseName = line;
      i++;
      continue;
    }

    if (headerPattern.test(line)) {
      i++;
      while (i < lines.length) {
        const classNbrLine = lines[i];
        if (!/^\d+$/.test(classNbrLine)) break;
        i++;

        if (i + 4 >= lines.length) break;
        const section = lines[i++].trim();
        const component = lines[i++].trim();
        const daysTimes = lines[i++].trim();
        const room = lines[i++].trim();

        const instructors: string[] = [];
        while (i < lines.length && !datesPattern.test(lines[i])) {
          const instructorLine = lines[i].trim();
          if (instructorLine) {
            instructors.push(instructorLine.replace(/,$/, ''));
          }
          i++;
        }
        const instructor = instructors.join(", ");

        if (i >= lines.length) break;

        const datesLine = lines[i].trim();
        const dateMatch = datesLine.match(datesPattern);
        let startDate = new Date();
        let endDate = new Date();
        if (dateMatch) {
          const parseDate = (d: string) => {
            const [day, month, year] = d.split('/').map(Number);
            return new Date(year, month - 1, day);
          };
          startDate = parseDate(dateMatch[1]);
          endDate = parseDate(dateMatch[2]);
        }
        i++;

        const { days, startTime, endTime } = parseDaysAndTimes(daysTimes);
        if (daysTimes.toUpperCase() === "TBA") {
          continue;
        }

        componentsList.push({
          courseName: currentCourseName,
          component,
          section,
          days,
          startTime,
          endTime,
          room,
          instructor,
          startDate,
          endDate
        });
      }
    } else {
      i++;
    }
  }

  return componentsList;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const scheduleData = req.body['scheduleData'];

  if (!scheduleData || typeof scheduleData !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing scheduleData in request body.' });
  }

  console.log(scheduleData); // Log the actual scheduleData content

  const courseComponents = parseCourseComponents(scheduleData);

  const cal = new ICalCalendar({
    prodId: { company: 'Course Schedule', product: 'EN' },
    name: 'Course Schedule',
    timezone: 'America/Toronto'
  });

  for (const comp of courseComponents) {
    for (const day of comp.days) {
      const start = new Date(comp.startDate);
      while (start.getDay() !== day) {
        start.setDate(start.getDate() + 1);
      }

      const startTime = parseTimeToDate(comp.startTime, start);
      const endTime = parseTimeToDate(comp.endTime, start);

      // Set UNTIL to the end of the last day
      const until = new Date(comp.endDate);
      until.setHours(23, 59, 59, 999); // Set to 23:59:59 on the last day

      cal.createEvent({
        start: startTime,
        end: endTime,
        summary: `${comp.courseName} (${comp.component})`,
        location: comp.room,
        description: `Instructor: ${comp.instructor}\nSection: ${comp.section}`,
        repeating: {
          freq: 'WEEKLY' as ICalEventRepeatingFreq,
          until: until // Ensure UNTIL includes the full last day
        }
      });
    }
  }

  res.setHeader('Content-Type', 'text/calendar');
  res.setHeader('Content-Disposition', 'attachment; filename="schedule.ics"');
  res.send(cal.toString());
}

