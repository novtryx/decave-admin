
export interface Event {
    stage:number;
    published:boolean;
    _id:string;
// stage 1
    eventDetails: {
        eventType: string;
        eventTitle: string;
        eventTheme: string;
        supportingText: string;
        eventBanner: string;
        startDate: Date;
        endDate: Date;
        venue:string;
        address?: string;
        brandColor: {
        primaryColor: string;
        secondaryColor: string;
        };
        eventVisibility: boolean;
    }
  // stage 2
  aboutEvent:{
        heading: string;
        description: string;
        content: {
            subTitle: string;
            sectionContent: string;
            supportingImage: string;
        }[];
  };

  //stage 3
  tickets:{
        ticketName: string;
        price: number;
        currency: string;
        initialQuantity:number;
        availableQuantity: number;
        benefits:string[];
        _id:string

  }[];

  //stage 4
  artistLineUp:{
    artistImage: string;
    artistName: string;
    artistGenre: string;
    headliner:boolean;
    socials:{
        instgram: string;
        twitter:string;
        website:string;
    };
  }[];
  //stage 5
  emergencyContact:{
    security: string;
    medical: string;
    lostButFound:string;
    supportingInfo?: string;
  }
  createdAt?: Date;
  updatedAt?: Date;
}


export interface TotalTicketStats {
  totalInitialTickets: number;
  totalSoldTickets: number;
}

