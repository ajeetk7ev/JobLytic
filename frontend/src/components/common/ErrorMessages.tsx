// components/ErrorField.tsx
interface ErrorFieldProps {
  messages?: string[];
}

export function ErrorField({ messages }: ErrorFieldProps) {
  if (!messages || messages.length === 0) return null;

  return (
    <ul className="text-red-400 text-xs mt-1 space-y-0.5">
      {messages.map((msg, i) => (
        <li key={i}>• {msg}</li>
      ))}
    </ul>
  );
}
