export class Reservation {
    id?: number;
    businessListingDiscountsId?: number;
    noOfDiners?: number;
    date?: string | null | Date;
    specialRequests?: string
    createdDate?: Date;
    updatedDate?: Date;
    createdBy?: number;
}