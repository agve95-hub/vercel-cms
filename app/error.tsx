"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) { return (<div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-center"><h1 className="text-4xl font-bold text-gray-900 mb-4">Something went wrong</h1><button onClick={reset} className="btn-primary">Try Again</button></div></div>); }
