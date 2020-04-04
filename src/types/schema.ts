export interface User {
    id: string;
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

export interface Dive {
    id: string;
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

export interface Club {
    id: string;
    name: string;
    location?: string;
    managers: [User];
    members: [User];
    website?: string;
}

export interface Gear {
    id: string;
    name?: string;
    brand?: string;
    model?: string;
    type?: string;
    owner: User;
}

export interface Group {
    id: string;
    name: string;
    participants: [User];
    messages: [Message];
}

export interface Message {
    id: string;
    text: string;
    sender: User;
}

export interface CreateUserInput {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserInput {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
}

export interface CreateDiveInput {
    id: string;
    timeIn?: string | any;
    timeOut?: string | any;
    bottomTime?: number;
    safetyStopTime?: number;
    maxDepth?: number;
    location?: string;
    description?: string;
    club?: string | object;
    buddies: [string];
    gear: [string];
    public?: boolean;
}

export interface UpdateDiveInput {
    timeIn?: string | any;
    timeOut?: string | any;
    bottomTime?: number;
    safetyStopTime?: number;
    maxDepth?: number;
    location?: string;
    description?: string;
    club?: string | object;
    public?: boolean;
}

export interface GearInput {
    name?: string;
    brand?: string;
    model?: string;
    type?: string;
}

export interface CreateGroupInput {
    name: string;
    participants: [string];
    text: string;
}
