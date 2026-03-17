import type { Task } from '../core/types.ts';

interface ParsedInput {
  subject: string;
  totalMinutes: number;
}

function parseNaturalInput(input: string): ParsedInput {
  const timeRegex = /(\d+(?:\.\d+)?)\s*(hours?|hrs?|h|minutes?|mins?|m|pomodoros?|poms?)/gi;
  let totalMinutes = 0;
  let match: RegExpExecArray | null;

  while ((match = timeRegex.exec(input)) !== null) {
    const value = parseFloat(match[1]);
    const unit = match[2].toLowerCase();
    if (unit.startsWith('h')) totalMinutes += value * 60;
    else if (unit.startsWith('m')) totalMinutes += value;
    else if (unit.startsWith('p')) totalMinutes += value * 25;
  }

  if (totalMinutes === 0) totalMinutes = 50;

  const subject = input
    .replace(timeRegex, '')
    .replace(/\b(study|learn|practice|work on|review|do|finish|complete)\b/gi, '')
    .trim()
    .replace(/\s+/g, ' ');

  return { subject: subject || 'Task', totalMinutes };
}

function splitIntoSubtasks(subject: string, totalMinutes: number): Omit<Task, 'id' | 'createdAt'>[] {
  const pomodoroMinutes = 25;
  const totalPomodoros = Math.max(1, Math.round(totalMinutes / pomodoroMinutes));

  if (totalPomodoros <= 2) {
    return [{
      title: subject,
      estimatedPomodoros: totalPomodoros,
      completedPomodoros: 0,
      completed: false,
      order: 0,
    }];
  }

  const phases = [
    { prefix: 'Review & plan', ratio: 0.2 },
    { prefix: 'Deep work on', ratio: 0.5 },
    { prefix: 'Practice & review', ratio: 0.3 },
  ];

  let assigned = 0;
  return phases.map((phase, i) => {
    const isLast = i === phases.length - 1;
    const poms = isLast
      ? totalPomodoros - assigned
      : Math.max(1, Math.round(totalPomodoros * phase.ratio));
    assigned += poms;
    return {
      title: `${phase.prefix} ${subject}`,
      estimatedPomodoros: poms,
      completedPomodoros: 0,
      completed: false,
      order: i,
    };
  });
}

export async function splitTaskWithAI(input: string): Promise<Omit<Task, 'id' | 'createdAt'>[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined;

  if (apiKey) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You split study/work goals into focused pomodoro tasks. Return JSON array: [{title, estimatedPomodoros}]. Each pomodoro is 25min. Be specific and actionable. Max 5 tasks.`,
            },
            { role: 'user', content: input },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      });

      if (res.ok) {
        const data = await res.json() as { choices: Array<{ message: { content: string } }> };
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const tasks = JSON.parse(jsonMatch[0]) as Array<{ title: string; estimatedPomodoros: number }>;
          return tasks.map((t, i) => ({
            title: t.title,
            estimatedPomodoros: t.estimatedPomodoros,
            completedPomodoros: 0,
            completed: false,
            order: i,
          }));
        }
      }
    } catch {
      // Fall through to offline
    }
  }

  const parsed = parseNaturalInput(input);
  return splitIntoSubtasks(parsed.subject, parsed.totalMinutes);
}
