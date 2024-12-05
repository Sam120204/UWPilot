import { NextApiRequest, NextApiResponse } from 'next';
import ical, { ICalEventRepeatingFreq } from 'ical-generator';
import { v4 as uuidv4 } from 'uuid';

interface CourseComponent {
  courseName: string;
  component: string;
  section: string;
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  startDate: Date;
  endDate: Date;
}

type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('Received request:', req.method);

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method Not Allowed' });
    console.log('Method not allowed');
    return;
  }

  const { scheduleData } = req.body;

  if (!scheduleData) {
    res.status(400).json({ error: 'Missing schedule data' });
    console.log('Missing schedule data in request body');
    return;
  }

  try {
    console.log('Parsing course components...');
    const courseComponents = parseCourseComponents(scheduleData);
    console.log('Parsed course components:', courseComponents);

    console.log('Generating iCalendar content...');
    const icsContent = generateICalendar(courseComponents);
    console.log('Generated iCalendar content');

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="uwaterloo_schedule.ics"'
    );
    res.status(200).send(icsContent);
    console.log('ICS file sent successfully');
  } catch (error) {
    console.error('Error generating ICS file:', error);
    res.status(500).json({ error: 'Error generating ICS file' });
  }
}

function parseCourseComponents(text: string): CourseComponent[] {
  const componentsList: CourseComponent[] = [];
  const lines = text.split(/\r?\n/).map((line) => line.trim());

  const courseNameLinePattern = /^[A-Z]{2,}\s+\d+[A-Z]*\s*-\s*.+$/; // e.g., CS 346 - Application Development
  const headerPattern =
    /^Class Nbr\s+Section\s+Component\s+Days & Times\s+Room\s+Instructor\s+Start\/End Date$/;
  const datesPattern = /(\d{2}\/\d{2}\/\d{4})\s*-\s*(\d{2}\/\d{2}\/\d{4})/;

  let currentCourseName = 'Unknown Course';
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Identify course name lines
    if (courseNameLinePattern.test(line)) {
      currentCourseName = line;
      console.log(`Found course: ${currentCourseName}`);
      index += 1;
      continue;
    }

    // Identify header lines
    if (headerPattern.test(line)) {
      console.log('Found header line');
      index += 1; // Move to the first class entry

      // Process class entries following the header
      while (index < lines.length) {
        // Check if the line is a class number (digits only)
        const classNbrLine = lines[index];
        if (!/^\d+$/.test(classNbrLine)) {
          console.log('No more class entries found');
          break; // Exit if the expected pattern doesn't match
        }

        const classNbr = classNbrLine;
        console.log(`Processing class number: ${classNbr}`);
        index += 1;
        if (index + 4 >= lines.length) {
          console.log('Not enough lines for a complete class entry');
          break;
        }

        const section = lines[index];
        index += 1;
        const component = lines[index];
        index += 1;
        const daysTimes = lines[index];
        index += 1;
        const room = lines[index];
        index += 1;

        // Read instructor lines until a line matches datesPattern
        const instructors: string[] = [];
        while (index < lines.length && !datesPattern.test(lines[index])) {
          const instructorLine = lines[index];
          if (instructorLine) {
            instructors.push(instructorLine.replace(/,$/, '')); // Remove trailing commas
          }
          index += 1;
        }

        const instructor = instructors.join(', ');

        // Now, the current line should match datesPattern
        if (index >= lines.length) {
          console.log('Reached end of lines while expecting dates');
          break;
        }

        const datesLine = lines[index];
        const datesMatch = datesLine.match(datesPattern);
        let startDate: Date;
        let endDate: Date;

        if (datesMatch) {
          const [startDateStr, endDateStr] = [datesMatch[1], datesMatch[2]];
          startDate = parseDate(startDateStr);
          endDate = parseDate(endDateStr);
          console.log(`Parsed dates: ${startDate} - ${endDate}`);
        } else {
          startDate = new Date();
          endDate = new Date();
          console.log('Dates not found, using current date');
        }

        index += 1; // Move to the next class entry

        // Parse days and times
        const { days, startTime, endTime } = parseDaysAndTimes(daysTimes);
        console.log(
          `Parsed days and times: ${days} ${startTime} - ${endTime}`
        );

        // Skip if Days & Times is TBA
        if (daysTimes.toUpperCase() === 'TBA') {
          console.log('Days & Times is TBA, skipping this entry');
          continue;
        }

        // Create CourseComponent
        const courseComponent: CourseComponent = {
          courseName: currentCourseName,
          component: component,
          section: section,
          days: days,
          startTime: startTime,
          endTime: endTime,
          room: room,
          instructor: instructor,
          startDate: startDate,
          endDate: endDate,
        };

        componentsList.push(courseComponent);
      }
    } else {
      // Not a course name or header line, skip
      index += 1;
    }
  }

  return componentsList;
}

function parseDate(dateStr: string): Date {
  // Assuming dateStr is in dd/MM/yyyy format
  const [dayStr, monthStr, yearStr] = dateStr.split('/');
  const day = parseInt(dayStr, 10);
  const month = parseInt(monthStr, 10) - 1; // Months are 0-based in JS Date
  const year = parseInt(yearStr, 10);
  return new Date(year, month, day);
}

function parseDaysAndTimes(daysTimes: string): {
  days: DayOfWeek[];
  startTime: string;
  endTime: string;
} {
  if (daysTimes.toUpperCase() === 'TBA') {
    return { days: [], startTime: '', endTime: '' };
  }

  const parts = daysTimes.split(' ', 2);
  if (parts.length < 2) {
    return { days: [], startTime: '', endTime: '' };
  }

  const daysPart = parts[0];
  const timePart = parts[1];

  // Map day abbreviations to DayOfWeek
  const dayMap: { [key: string]: DayOfWeek } = {
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    Th: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    Su: 'Sunday',
  };

  // Extract days
  const days: DayOfWeek[] = [];
  let index = 0;
  while (index < daysPart.length) {
    if (daysPart.startsWith('Th', index)) {
      days.push('Thursday');
      index += 2;
    } else if (daysPart.startsWith('Su', index)) {
      days.push('Sunday');
      index += 2;
    } else {
      const dayChar = daysPart[index];
      if (dayMap[dayChar]) {
        days.push(dayMap[dayChar]);
      }
      index += 1;
    }
  }

  // Attempt to parse 12-hour format
  const timeRegex12 = /(\d{1,2}):(\d{2})(AM|PM)\s*-\s*(\d{1,2}):(\d{2})(AM|PM)/i;
  const timeMatch12 = timeRegex12.exec(timePart);

  if (timeMatch12) {
    const startTime = `${timeMatch12[1]}:${timeMatch12[2]}${timeMatch12[3].toUpperCase()}`;
    const endTime = `${timeMatch12[4]}:${timeMatch12[5]}${timeMatch12[6].toUpperCase()}`;
    return { days, startTime, endTime };
  }

  // Attempt to parse 24-hour format
  const timeRegex24 = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/;
  const timeMatch24 = timeRegex24.exec(timePart);

  if (timeMatch24) {
    const startTime = `${timeMatch24[1]}:${timeMatch24[2]}`;
    const endTime = `${timeMatch24[3]}:${timeMatch24[4]}`;
    return { days, startTime, endTime };
  }

  // If parsing fails, return empty times
  console.log(`Failed to parse time: ${timePart}`);
  return { days, startTime: '', endTime: '' };
}

function getDayOfWeekIndex(day: DayOfWeek): number {
  const dayMap: { [key in DayOfWeek]: number } = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return dayMap[day];
}

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const time12Regex = /(\d{1,2}):(\d{2})(AM|PM)/i;
  const time24Regex = /(\d{1,2}):(\d{2})/;

  let match = time12Regex.exec(timeStr);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === 'PM' && hours < 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }
    return { hours, minutes };
  }

  match = time24Regex.exec(timeStr);
  if (match) {
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return { hours, minutes };
  }

  throw new Error(`Invalid time format: ${timeStr}`);
}

function combineDateTime(date: Date, timeStr: string): Date {
  const { hours, minutes } = parseTime(timeStr);
  const dateTime = new Date(date);
  dateTime.setHours(hours);
  dateTime.setMinutes(minutes);
  dateTime.setSeconds(0);
  dateTime.setMilliseconds(0);
  return dateTime;
}

function generateICalendar(courseComponents: CourseComponent[]): string {
  const calendar = ical({
    name: 'Course Schedule',
    timezone: 'America/Toronto',
  });

  for (const component of courseComponents) {
    for (const day of component.days) {
      // Find the first occurrence of the day in the date range
      let firstDate = new Date(component.startDate);
      const dayOfWeekIndex = getDayOfWeekIndex(day);

      while (firstDate.getDay() !== dayOfWeekIndex) {
        firstDate.setDate(firstDate.getDate() + 1);
      }

      // Combine date and time
      const startDateTime = combineDateTime(firstDate, component.startTime);
      const endDateTime = combineDateTime(firstDate, component.endTime);

      // Create event
      calendar.createEvent({
        start: startDateTime,
        end: endDateTime,
        summary: `${component.courseName} (${component.component})`,
        location: component.room,
        description: `Instructor: ${component.instructor}\nSection: ${component.section}`,
        uid: uuidv4(),
        repeating: {
          freq: ICalEventRepeatingFreq.WEEKLY,
          until: component.endDate,
        },
      });

      console.log(
        `Event created: ${component.courseName} on ${day} from ${component.startTime} to ${component.endTime}`
      );
    }
  }

  return calendar.toString();
}

