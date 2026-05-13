"use client";

import { api, type FeedbackRequest, type Feedback } from "@/lib/api-client";

/**
 * Starts the feedback flow: backend stores the row (unpublished), emails a
 * 6-digit code, and returns the feedback_id used by the next two calls.
 */
export type RequestResponse = { feedback_id: string; expires_in: number };

export async function requestFeedback(payload: FeedbackRequest) {
  return api.post<RequestResponse>("/api/feedback", payload);
}

/** Verifies the 6-digit code. On success the backend flips published=true. */
export async function verifyFeedback(feedbackId: string, code: string) {
  return api.post<{ ok: true; feedback_id: string }>(
    `/api/feedback/${feedbackId}/verify`,
    { code }
  );
}

/** Resends a fresh 6-digit code to the originally-submitted email. */
export async function resendFeedbackCode(feedbackId: string) {
  return api.post<{ ok: true; expires_in: number }>(
    `/api/feedback/${feedbackId}/resend`
  );
}

/** Fetches published feedbacks for display in the Témoignages section. */
export async function listPublishedFeedbacks(): Promise<Feedback[]> {
  const data = await api.get<{ items: Feedback[] }>("/api/feedback/published");
  return data.items ?? [];
}
