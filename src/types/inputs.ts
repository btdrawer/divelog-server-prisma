export interface Input {}

export interface CreateUserInput extends Input {
    name: string;
    username: string;
    email: string;
    password: string;
}

export interface UpdateUserInput extends Input {
    name?: string;
    username?: string;
    email?: string;
    password?: string;
}

export interface MutateDiveInput extends Input {
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

export interface CreateDiveInput extends MutateDiveInput {
    buddies?: ConnectInput;
    gear?: ConnectInput;
    user?: ConnectInput;
}

export interface UpdateDiveInput extends MutateDiveInput {}

export interface CreateClubInput extends Input {
    name: string;
    location: string;
    managers?: ConnectInput;
    members?: ConnectInput;
    website?: string;
}

export interface UpdateClubInput extends Input {
    name?: string;
    location?: string;
    website?: string;
}

export interface GearInput extends Input {
    name?: string;
    brand?: string;
    model?: string;
    type?: string;
    owner?: ConnectInput;
}

export interface CreateGroupInput extends Input {
    name: string;
    participants: string[];
    text: string;
}

export type ConnectInput = {
    connect:
        | {
              id: string;
          }
        | {
              id: string;
          }[];
};
