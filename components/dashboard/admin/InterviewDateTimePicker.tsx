'use client';

type InterviewDateTimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
};

const pad = (value: number) => String(value).padStart(2, '0');

export function InterviewDateTimePicker({ value, onChange, min }: InterviewDateTimePickerProps) {
  const [date = '', time = ''] = value.split('T');
  const [rawHour = '09', minute = '00'] = time.split(':');
  const hour24 = Number(rawHour);
  const hour12 = hour24 % 12 || 12;
  const period = hour24 >= 12 ? 'PM' : 'AM';

  const update = (nextDate: string, nextHour: number, nextMinute: string, nextPeriod: string) => {
    const convertedHour = nextPeriod === 'PM' ? nextHour % 12 + 12 : nextHour % 12;
    onChange(`${nextDate}T${pad(convertedHour)}:${nextMinute}`);
  };

  return <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(68px,.75fr)_minmax(68px,.75fr)_minmax(76px,.8fr)] gap-2">
    <label className="min-w-0 text-xs font-medium text-slate-600">Date
      <input aria-label="Interview date" type="date" value={date} min={min?.slice(0, 10)} onChange={(event) => update(event.target.value, hour12, minute, period)} className="mt-1 h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-800" />
    </label>
    <label className="text-xs font-medium text-slate-600">Hour
      <select aria-label="Interview hour" value={pad(hour12)} onChange={(event) => update(date, Number(event.target.value), minute, period)} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-800">
        {Array.from({ length: 12 }, (_, index) => pad(index + 1)).map((hour) => <option key={hour} value={hour}>{hour}</option>)}
      </select>
    </label>
    <label className="text-xs font-medium text-slate-600">Minute
      <select aria-label="Interview minute" value={minute || '00'} onChange={(event) => update(date, hour12, event.target.value, period)} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm text-slate-800">
        {Array.from({ length: 60 }, (_, index) => pad(index)).map((value) => <option key={value} value={value}>{value}</option>)}
      </select>
    </label>
    <label className="text-xs font-medium text-slate-600">AM / PM
      <select aria-label="AM or PM" value={period} onChange={(event) => update(date, hour12, minute, event.target.value)} className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800">
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </label>
  </div>;
}
