import { KanbanBoard } from '../components/KanbanBoard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Kanban Board
        </h1>
        <KanbanBoard />
      </div>
    </div>
  );
}
