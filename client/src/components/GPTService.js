export async function fetchReflection(entry) {
  const response = await fetch('/api/reflect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.reflection) {
    throw new Error(data.error || 'Could not get AI reflection');
  }

  return {
    reflection: data.reflection,
    growthScore: data.growthScore ?? null,
    scoreReason: data.scoreReason ?? null,
  };
}
