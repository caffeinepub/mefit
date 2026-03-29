import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize access control
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  type UserProfileId = Nat;
  type DietLogId = Nat;
  type FitnessLogId = Nat;
  type HealthLogId = Nat;
  type PregnancyReportId = Nat;
  type ReminderId = Nat;
  type ChallengeId = Nat;
  type ChallengeProgressId = Nat;
  type MediaItemId = Nat;
  type MotivationalQuoteId = Nat;

  module UserProfileId {
    public func toText(id : UserProfileId) : Text {
      id.toText();
    };
  };

  module DietLogId {
    public func toText(id : DietLogId) : Text {
      id.toText();
    };
  };

  module FitnessLogId {
    public func toText(id : FitnessLogId) : Text {
      id.toText();
    };
  };

  module HealthLogId {
    public func toText(id : HealthLogId) : Text {
      id.toText();
    };
  };

  module PregnancyReportId {
    public func toText(id : PregnancyReportId) : Text {
      id.toText();
    };
  };

  module ReminderId {
    public func toText(id : ReminderId) : Text {
      id.toText();
    };
  };

  module ChallengeId {
    public func toText(id : ChallengeId) : Text {
      id.toText();
    };
  };

  module ChallengeProgressId {
    public func toText(id : ChallengeProgressId) : Text {
      id.toText();
    };
  };

  module MediaItemId {
    public func toText(id : MediaItemId) : Text {
      id.toText();
    };
  };

  module MotivationalQuoteId {
    public func toText(id : MotivationalQuoteId) : Text {
      id.toText();
    };
  };

  type UserId = Text;
  type DateString = Text;
  type Name = Text;

  public type UserProfile = {
    id : UserId;
    role : Text;
    name : Name;
    weight : Float;
    height : Float;
    pregnancyWeek : Nat;
    bloodPressure : Text;
    bloodSugar : Text;
    lmp : DateString;
    friends : [UserId];
  };

  public type DietLog = {
    id : UserId;
    userId : UserId;
    date : DateString;
    mealType : Text;
    items : Text;
    calories : Float;
    protein : Float;
    carbs : Float;
    fat : Float;
    photoId : ?UserId;
  };

  public type FitnessLog = {
    id : UserId;
    userId : UserId;
    date : DateString;
    steps : Nat;
    exerciseType : Text;
    duration : Nat;
    notes : Text;
  };

  public type HealthLog = {
    id : UserId;
    userId : UserId;
    date : DateString;
    logType : Text;
    value : Text;
  };

  public type PregnancyReport = {
    id : UserId;
    userId : UserId;
    date : DateString;
    doctorName : Name;
    notes : Text;
    fileId : ?UserId;
  };

  public type Reminder = {
    id : UserId;
    userId : UserId;
    reminderType : Text;
    title : Text;
    datetime : DateString;
    repeat : Text;
  };

  public type Challenge = {
    id : UserId;
    title : Text;
    description : Text;
    targetValue : Nat;
    unit : Text;
    isActive : Bool;
  };

  public type ChallengeProgress = {
    id : UserId;
    userId : UserId;
    challengeId : UserId;
    currentValue : Nat;
  };

  public type MediaItem = {
    id : UserId;
    mediaType : Text;
    title : Text;
    content : Text;
    link : ?Text;
  };

  public type MotivationalQuote = {
    id : UserId;
    text : Text;
    author : Name;
  };

  public type BodySnapshot = {
    id : UserProfileId;
    userId : UserProfileId;
    date : DateString;
    photoId : UserProfileId;
  };

  public type LeaderboardEntry = {
    userId : Text;
    name : Text;
    weeklySteps : Nat;
    dietScore : Float;
  };

  public type PregnancyWellnessData = {
    userProfiles : [UserProfile];
    dietLogs : [DietLog];
    fitnessLogs : [FitnessLog];
    healthLogs : [HealthLog];
    pregnancyReports : [PregnancyReport];
    reminders : [Reminder];
    challenges : [Challenge];
    challengeProgress : [ChallengeProgress];
    mediaItems : [MediaItem];
    motivationalQuotes : [MotivationalQuote];
    bodySnapshots : [BodySnapshot];
  };

  var nextUserProfileId = 0;
  var nextDietLogId = 0;
  var nextFitnessLogId = 0;
  var nextHealthLogId = 0;
  var nextPregnancyReportId = 0;
  var nextReminderId = 0;
  var nextChallengeId = 0;
  var nextChallengeProgressId = 0;
  var nextMediaItemId = 0;
  var nextMotivationalQuoteId = 0;

  let userProfiles = Map.empty<UserProfileId, UserProfile>();
  let dietLogs = Map.empty<DietLogId, DietLog>();
  let fitnessLogs = Map.empty<FitnessLogId, FitnessLog>();
  let healthLogs = Map.empty<HealthLogId, HealthLog>();
  let pregnancyReports = Map.empty<PregnancyReportId, PregnancyReport>();
  let reminders = Map.empty<ReminderId, Reminder>();
  let challenges = Map.empty<ChallengeId, Challenge>();
  let challengeProgress = Map.empty<ChallengeProgressId, ChallengeProgress>();
  let mediaItems = Map.empty<MediaItemId, MediaItem>();
  let motivationalQuotes = Map.empty<MotivationalQuoteId, MotivationalQuote>();
  let bodySnapshots = Map.empty<UserProfileId, BodySnapshot>();

  // Map Principal to UserProfile for access control integration
  let principalToProfile = Map.empty<Principal, UserProfile>();

  module LeaderboardEntry {
    public func compare(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
      Nat.compare(b.weeklySteps, a.weeklySteps);
    };
  };

  // Required profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    principalToProfile.get(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    principalToProfile.add(caller, profile);
  };

  public query ({ caller }) func getUserProfile(id : UserId) : async ?UserProfile {
    // Users can view their own profile, admins can view any profile
    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != id and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own profile");
        };
      };
    };

    let userEntry = userProfiles.entries().find(
      func(_, user) {
        user.id == id
      }
    );
    switch (userEntry) {
      case (?(_, user)) { ?user };
      case (null) { null };
    };
  };

  // Leaderboard is public (read-only)
  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    userProfiles.entries().map(
      func((_, user)) {
        {
          userId = user.id;
          name = user.name;
          weeklySteps = 0;
          dietScore = 0.0;
        };
      }
    ).toArray().sort();
  };

  // User profile creation - users only
  public shared ({ caller }) func createUserProfile(profile : UserProfile) : async UserProfileId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    let id = nextUserProfileId;
    nextUserProfileId += 1;
    let newProfile = { profile with id = id.toText() };
    userProfiles.add(id, newProfile);
    principalToProfile.add(caller, newProfile);
    id;
  };

  // Diet log - users can only create their own
  public shared ({ caller }) func createDietLog(log : DietLog) : async DietLogId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create diet logs");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != log.userId) {
          Runtime.trap("Unauthorized: Can only create diet logs for yourself");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextDietLogId;
    nextDietLogId += 1;
    let newLog = { log with id = id.toText() };
    dietLogs.add(id, newLog);
    id;
  };

  // Fitness log - users can only create their own
  public shared ({ caller }) func createFitnessLog(log : FitnessLog) : async FitnessLogId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create fitness logs");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != log.userId) {
          Runtime.trap("Unauthorized: Can only create fitness logs for yourself");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextFitnessLogId;
    nextFitnessLogId += 1;
    let newLog = { log with id = id.toText() };
    fitnessLogs.add(id, newLog);
    id;
  };

  // Health log - users can only create their own
  public shared ({ caller }) func createHealthLog(log : HealthLog) : async HealthLogId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create health logs");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != log.userId) {
          Runtime.trap("Unauthorized: Can only create health logs for yourself");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextHealthLogId;
    nextHealthLogId += 1;
    let newLog = { log with id = id.toText() };
    healthLogs.add(id, newLog);
    id;
  };

  // Pregnancy report - doctors/admins can create for patients
  public shared ({ caller }) func createPregnancyReport(report : PregnancyReport) : async PregnancyReportId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create pregnancy reports");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        // Doctors and admins can create reports for any user
        if (profile.role != "doctor" and profile.role != "admin" and profile.id != report.userId) {
          Runtime.trap("Unauthorized: Only doctors can create reports for other users");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextPregnancyReportId;
    nextPregnancyReportId += 1;
    let newReport = { report with id = id.toText() };
    pregnancyReports.add(id, newReport);
    id;
  };

  // Reminder - users can only create their own
  public shared ({ caller }) func createReminder(reminder : Reminder) : async ReminderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create reminders");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != reminder.userId) {
          Runtime.trap("Unauthorized: Can only create reminders for yourself");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextReminderId;
    nextReminderId += 1;
    let newReminder = { reminder with id = id.toText() };
    reminders.add(id, newReminder);
    id;
  };

  // Challenge - admin only
  public shared ({ caller }) func createChallenge(challenge : Challenge) : async ChallengeId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create challenges");
    };

    let id = nextChallengeId;
    nextChallengeId += 1;
    let newChallenge = { challenge with id = id.toText() };
    challenges.add(id, newChallenge);
    id;
  };

  // Challenge progress - users can only create their own
  public shared ({ caller }) func createChallengeProgress(progress : ChallengeProgress) : async ChallengeProgressId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create challenge progress");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != progress.userId) {
          Runtime.trap("Unauthorized: Can only create challenge progress for yourself");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let id = nextChallengeProgressId;
    nextChallengeProgressId += 1;
    let newProgress = { progress with id = id.toText() };
    challengeProgress.add(id, newProgress);
    id;
  };

  // Media item - admin only
  public shared ({ caller }) func createMediaItem(item : MediaItem) : async MediaItemId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create media items");
    };

    let id = nextMediaItemId;
    nextMediaItemId += 1;
    let newItem = { item with id = id.toText() };
    mediaItems.add(id, newItem);
    id;
  };

  // Motivational quote - admin only
  public shared ({ caller }) func createMotivationalQuote(quote : MotivationalQuote) : async MotivationalQuoteId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create motivational quotes");
    };

    let id = nextMotivationalQuoteId;
    nextMotivationalQuoteId += 1;
    let newQuote = { quote with id = id.toText() };
    motivationalQuotes.add(id, newQuote);
    id;
  };

  // Add friend - users can only manage their own friends
  public shared ({ caller }) func addFriend(userId : UserId, friendId : UserId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add friends");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != userId) {
          Runtime.trap("Unauthorized: Can only add friends to your own profile");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let userEntry = userProfiles.entries().find(
      func(_, user) {
        user.id == userId
      }
    );
    let friendEntry = userProfiles.entries().find(
      func(_, user) {
        user.id == friendId
      }
    );
    switch (userEntry, friendEntry) {
      case (?userEntry, ?_) {
        if (userEntry.1.friends.find(func(f) { f == friendId }) != null) {
          return;
        };
        let updatedFriends = userEntry.1.friends.concat([friendId]);
        let updatedUser : UserProfile = {
          userEntry.1 with
          friends = updatedFriends
        };
        userProfiles.add(userEntry.0, updatedUser);
      };
      case (null, ?_) { Runtime.trap("User not found") };
      case (_, null) { Runtime.trap("Friend not found") };
    };
  };

  // Get friends - users can only view their own friends
  public query ({ caller }) func getFriends(userId : UserId) : async [UserId] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view friends");
    };

    let callerProfile = principalToProfile.get(caller);
    switch (callerProfile) {
      case (?profile) {
        if (profile.id != userId and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own friends");
        };
      };
      case (null) {
        Runtime.trap("Unauthorized: User profile not found");
      };
    };

    let userEntry = userProfiles.entries().find(
      func(_, user) {
        user.id == userId
      }
    );
    switch (userEntry) {
      case (?(_, user)) { user.friends };
      case (null) { [] };
    };
  };
};
