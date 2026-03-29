import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    userId: string;
    name: string;
    dietScore: number;
    weeklySteps: bigint;
}
export interface ChallengeProgress {
    id: UserId;
    userId: UserId;
    currentValue: bigint;
    challengeId: UserId;
}
export type ReminderId = bigint;
export type ChallengeId = bigint;
export type FitnessLogId = bigint;
export interface MediaItem {
    id: UserId;
    title: string;
    content: string;
    link?: string;
    mediaType: string;
}
export interface Challenge {
    id: UserId;
    title: string;
    unit: string;
    description: string;
    isActive: boolean;
    targetValue: bigint;
}
export type MediaItemId = bigint;
export type PregnancyReportId = bigint;
export interface PregnancyReport {
    id: UserId;
    userId: UserId;
    date: DateString;
    fileId?: UserId;
    notes: string;
    doctorName: Name;
}
export interface Reminder {
    id: UserId;
    repeat: string;
    title: string;
    userId: UserId;
    reminderType: string;
    datetime: DateString;
}
export type DietLogId = bigint;
export type DateString = string;
export type ChallengeProgressId = bigint;
export interface FitnessLog {
    id: UserId;
    duration: bigint;
    userId: UserId;
    date: DateString;
    steps: bigint;
    notes: string;
    exerciseType: string;
}
export interface MotivationalQuote {
    id: UserId;
    text: string;
    author: Name;
}
export interface DietLog {
    id: UserId;
    fat: number;
    carbs: number;
    userId: UserId;
    date: DateString;
    calories: number;
    items: string;
    mealType: string;
    protein: number;
    photoId?: UserId;
}
export type Name = string;
export type UserProfileId = bigint;
export interface HealthLog {
    id: UserId;
    value: string;
    userId: UserId;
    date: DateString;
    logType: string;
}
export type UserId = string;
export type HealthLogId = bigint;
export type MotivationalQuoteId = bigint;
export interface UserProfile {
    id: UserId;
    lmp: DateString;
    weight: number;
    height: number;
    name: Name;
    role: string;
    bloodPressure: string;
    bloodSugar: string;
    pregnancyWeek: bigint;
    friends: Array<UserId>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFriend(userId: UserId, friendId: UserId): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChallenge(challenge: Challenge): Promise<ChallengeId>;
    createChallengeProgress(progress: ChallengeProgress): Promise<ChallengeProgressId>;
    createDietLog(log: DietLog): Promise<DietLogId>;
    createFitnessLog(log: FitnessLog): Promise<FitnessLogId>;
    createHealthLog(log: HealthLog): Promise<HealthLogId>;
    createMediaItem(item: MediaItem): Promise<MediaItemId>;
    createMotivationalQuote(quote: MotivationalQuote): Promise<MotivationalQuoteId>;
    createPregnancyReport(report: PregnancyReport): Promise<PregnancyReportId>;
    createReminder(reminder: Reminder): Promise<ReminderId>;
    createUserProfile(profile: UserProfile): Promise<UserProfileId>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFriends(userId: UserId): Promise<Array<UserId>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getUserProfile(id: UserId): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
