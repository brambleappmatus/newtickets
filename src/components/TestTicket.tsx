import React from 'react';
import { createTicket } from '../services/ticketService';
import { RetroMessage } from './RetroMessage';

export function TestTicket() {
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleCreateTestTicket = async () => {
    try {
      setError(null);
      setSuccess(false);

      const testTicket = {
        title: "Test Ticket",
        category: "categories_56cb1be0b1393068423655", // Using a constant category ID
        stage: "OPEN",
        priority: "LOW",
        description: "This is a test ticket"
      };

      await createTicket(testTicket);
      setSuccess(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create ticket');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateTestTicket}
        className="mac-button px-4 py-2"
      >
        Create Test Ticket
      </button>

      {error && <RetroMessage type="error" message={error} />}
      {success && <RetroMessage type="success" message="Test ticket created successfully!" />}
    </div>
  );
}