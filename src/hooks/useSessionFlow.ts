// src/hooks/useSessionFlow.ts
import { useState, useCallback } from 'react';

export const SessionFlowState = {
  IDLE: 'idle',
  SELECTING_TYPE: 'selecting_type',
  COLLECTING_METADATA: 'collecting_metadata',
  SUBMITTING: 'submitting',
  NAVIGATING: 'navigating',
} as const;
export type SessionFlowState =
  (typeof SessionFlowState)[keyof typeof SessionFlowState];
export type SelectedMeetingType = 'CARGO_DAMAGE' | 'SIMPLE_MEETING' | 'INSURANCE_VISIT';

export interface SessionData {
  name: string;
  emptyTimeout: number;
  sessionExpiry: number;
  maxParticipants: number;
  metadata: Record<string, unknown>;
}

const DEFAULT_SESSION_DATA: SessionData = {
  name: '',
  emptyTimeout: 1,
  sessionExpiry: 600,
  maxParticipants: 15,
  metadata: {},
};

export function useSessionFlow(initialType?: SelectedMeetingType) {
  const [flowState, setFlowState] = useState<SessionFlowState>(
    initialType ? SessionFlowState.COLLECTING_METADATA : SessionFlowState.SELECTING_TYPE
  );
  const [selectedType, setSelectedType] = useState<SelectedMeetingType | null>(initialType ?? null);
  const [sessionData, setSessionData] = useState<SessionData>(DEFAULT_SESSION_DATA);

  const selectType = useCallback((type: SelectedMeetingType) => {
    setSelectedType(type);
    setFlowState(SessionFlowState.COLLECTING_METADATA);
  }, []);

  const goBackToTypeSelection = useCallback(() => {
    setFlowState(SessionFlowState.SELECTING_TYPE);
  }, []);

  const commitSessionData = useCallback((data: SessionData) => {
    setSessionData(data);
    setFlowState(SessionFlowState.SUBMITTING);
  }, []);

  const startOver = useCallback(() => {
    setFlowState(SessionFlowState.SELECTING_TYPE);
    setSelectedType(null);
    setSessionData(DEFAULT_SESSION_DATA);
  }, []);

  return {
    flowState,
    selectedType,
    sessionData,
    selectType,
    goBackToTypeSelection,
    commitSessionData,
    startOver,
    setFlowState,
  };
}
