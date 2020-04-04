export interface TypeDef {
    id: string;
}

export interface User extends TypeDef {
    name: string;
    username: string;
    email: string;
    dives: [Dive];
    managerOfClubs: [Club];
    memberOfClubs: [Club];
    gear: [Gear];
    friends: [User];
    friendRequestsInbox: [User];
    friendRequestsSent: [User];
}

export interface AuthPayload extends TypeDef {
    user: User;
    token: string;
}

export interface Dive extends TypeDef {
    timeIn?: string;
    timeOut?: string;
    bottomTime?: number;
    safetyStopTime?: number;
    diveTime?: number;
    maxDepth?: number;
    location?: string;
    description?: string;
    club?: Club;
    user?: User;
    buddies: [User];
    gear: [Gear];
    public?: boolean;
}

export interface Club extends TypeDef {
    name: string;
    location: string;
    managers: [User];
    members: [User];
    website?: string;
}

export interface Gear extends TypeDef {
    name?: string;
    brand?: string;
    model?: string;
    type?: string;
    owner: User;
}

export interface Group extends TypeDef {
    name: string;
    participants: [User];
    messages: [Message];
}

export interface Message extends TypeDef {
    text: string;
    sender: User;
}
