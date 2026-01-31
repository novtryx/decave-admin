import Image from 'next/image';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type TicketType = 'platinum' | 'gold' | 'silver' | 'bronze';

interface Event {
  name: string;
}

interface PartnerCardProps {
  logoUrl: string;
  name: string;
  ticketType: TicketType;
  status: boolean;
  contactPerson: string;
  email: string;
  phone: string;
  associatedEvents: {
    _id: string;
    eventDetails: {
      eventTitle: string;
    };
  }[];
  activationNotes: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PartnerCard: React.FC<PartnerCardProps> = ({
  logoUrl,
  name,
  ticketType,
  status,
  contactPerson,
  email,
  phone,
  associatedEvents,
  activationNotes,
  onEdit,
  onDelete,
}) => {
  const getTicketColor = (ticket: TicketType): string => {
    const colors = {
      platinum: 'bg-gradient-to-r from-[#D4D4D8] to-[#9F9FA9] text-[#18181B]',
      gold: 'bg-gradient-to-r from-[#DFA91E] to-[#BA8703] text-white',
      silver: 'bg-[#c0c0c0] text-gray-800',
      bronze: 'bg-[#cd7f32] text-white',
    };
    return colors[ticket];
  };

  const getStatusColor = (status: boolean): string => {
    return status ? 'bg-[#0F2A1A] text-[#22C55E]' : 'bg-red-600/20 text-red-500';
  };

  return (
    <div className="w-full bg-[#18181B] border border-[#27272A] rounded-xl p-4 sm:p-6 pb-6 sm:pb-10 text-white hover:border-[#3a3a3a] transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start border-b border-[#2a2a2a] pb-4 mb-4 gap-3">
        <div className="flex items-start sm:items-center gap-3 flex-1 w-full">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#2A2A2A] rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-medium text-[#F4F4F5] truncate">
              {name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-1">
              <span
                className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium capitalize ${getTicketColor(
                  ticketType
                )}`}
              >
                {ticketType}
              </span>
              <span
                className={`text-xs px-2 sm:px-3 py-1 rounded-full font-medium ${getStatusColor(
                  status
                )}`}
              >
                {status ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 self-end sm:self-start">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Edit partner"
          >
            <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white transition-colors" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Delete partner"
          >
            <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Contact Person */}
      <div className="mb-4">
        <p className="text-[#B3B3B3] text-xs sm:text-sm mb-1">Contact Person</p>
        <p className="text-[#F9F7F4] text-sm sm:text-base truncate">{contactPerson}</p>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
        <div className="min-w-0">
          <p className="text-[#B3B3B3] text-xs sm:text-sm mb-1">Email</p>
          <p className="text-[#f9f7f4] text-sm sm:text-base truncate" title={email}>
            {email}
          </p>
        </div>
        <div className="min-w-0">
          <p className="text-[#B3B3B3] text-xs sm:text-sm mb-1">Phone</p>
          <p className="text-[#f9f7f4] text-sm sm:text-base">{phone}</p>
        </div>
      </div>

      {/* Associated Events */}
      <div className="mb-4">
        <p className="text-[#B3B3B3] text-xs sm:text-sm mb-2">Associated Events</p>
        <div className="flex flex-wrap gap-2">
          {associatedEvents.length > 0 ? (
            <>
              {associatedEvents.slice(0, 2).map((event) => (
                <span
                  key={event._id}
                  className="bg-[#27272A] text-[#D4D4D8] text-xs sm:text-sm px-2 sm:px-3 py-1 rounded truncate max-w-full"
                  title={event.eventDetails.eventTitle}
                >
                  {event.eventDetails.eventTitle}
                </span>
              ))}
              {associatedEvents.length > 2 && (
                <span className="bg-[#2a2a2a] text-gray-400 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
                  +{associatedEvents.length - 2} more
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500 text-xs sm:text-sm italic">
              No events associated
            </span>
          )}
        </div>
      </div>

      {/* Activation Notes */}
      <div className="border-t border-[#2a2a2a] pt-4">
        <p className="text-[#b3b3b3] text-xs sm:text-sm mb-1">Activation Notes</p>
        {activationNotes ? (
          <p className="text-[#f9f7f4] text-sm sm:text-base leading-relaxed line-clamp-3">
            {activationNotes}
          </p>
        ) : (
          <p className="text-gray-500 text-xs sm:text-sm italic">No notes available</p>
        )}
      </div>
    </div>
  );
};

export default PartnerCard;