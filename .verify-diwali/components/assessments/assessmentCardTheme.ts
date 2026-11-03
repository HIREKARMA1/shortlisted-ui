export function getAssessmentCardColorScheme(index: number) {
  const colors = [
    { bg: 'bg-blue-50', border: 'border-blue-200', hover: 'hover:border-blue-300' },
    { bg: 'bg-green-50', border: 'border-green-200', hover: 'hover:border-green-300' },
    { bg: 'bg-emerald-50', border: 'border-emerald-200', hover: 'hover:border-emerald-300' },
    { bg: 'bg-red-50', border: 'border-red-200', hover: 'hover:border-red-300' },
    { bg: 'bg-purple-50', border: 'border-purple-200', hover: 'hover:border-purple-300' },
    { bg: 'bg-orange-50', border: 'border-orange-200', hover: 'hover:border-orange-300' },
    { bg: 'bg-cyan-50', border: 'border-cyan-200', hover: 'hover:border-cyan-300' },
    { bg: 'bg-pink-50', border: 'border-pink-200', hover: 'hover:border-pink-300' },
    { bg: 'bg-indigo-50', border: 'border-indigo-200', hover: 'hover:border-indigo-300' },
  ];
  return colors[index % colors.length];
}

export function formatAssessmentDate(dateString: string) {
  try {
    if (!dateString) return 'Invalid date';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return 'Invalid date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Invalid date';
  }
}
