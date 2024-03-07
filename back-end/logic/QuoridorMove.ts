export interface QuoridorMove {
    pawnMove?: PawnLocation,
    wallMove?: WallLocation,
}

export interface PawnLocation {
    r: number,
    c: number,
}

export interface WallLocation {
    r: number,
    c: number,
}