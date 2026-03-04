export type AppState = 'INITIALIZING' | 'LOGIN_FORM' | 'DASHBOARD' | 'WORKFLOW' | 'EXECUTING' | 'TERMINAL' | 'SUMMARY';

export interface WorkflowStage {
  id: string;
  label: string;
  status: 'completed' | 'pending' | 'locked';
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: string;
}

export interface EventModule {
  id: string;
  title: string;
  type: 'TECHNICAL' | 'NON-TECHNICAL';
  tagline: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}
