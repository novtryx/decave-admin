import Image from 'next/image';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type TicketType = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

interface Event {
  name: string;
}

interface PartnerCardProps {
  logoUrl: string;
  name: string;
  ticketType: TicketType;
  status: 'Active' | 'Inactive';
  contactPerson: string;
  email: string;
  phone: string;
  associatedEvents: Event[];
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
      Platinum: 'bg-linear-to-r from-[#D4D4D8] to-[#9F9FA9] text-[#18181B]',
      Gold: 'bg-linear-to-r from-[#DFA91E] to-[#BA8703] text-white',
      Silver: 'bg-[#c0c0c0] text-gray-800',
      Bronze: 'bg-[#cd7f32] text-white',
    };
    return colors[ticket];
  };

  const getStatusColor = (status: string): string => {
    return status === 'Active' ? 'bg-[#0F2A1A] text-[#22C55E]' : 'bg-red-600 text-white';
  };

  return (
    <div className="w-full  bg-[#18181B] border border-[#27272A] rounded-xl p-6 pb-10 text-white">
      {/* Header */}
      <div className="flex items-start border-b border-[#2a2a2a] pb-4 justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 border border-[#2A2A2A] rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src={logoUrl}
              alt={`${name} logo`}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-lg font-medium text-[#F4F4F5]">{name}</h2>
            <div className="flex gap-2 mt-1">
              <span className={`text-xs px-3 py-1 rounded-full ${getTicketColor(ticketType)}`}>
                {ticketType}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Edit"
          >
            <FiEdit2 className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-gray-800 rounded transition-colors"
            aria-label="Delete"
          >
            <FiTrash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>

      {/* Contact Person */}
      <div className="mb-4">
        <p className="text-[#B3B3B3] text-sm mb-1">Contact Person</p>
        <p className="text-[#F9F7F4]">{contactPerson}</p>
      </div>

      {/* Email and Phone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-[#B3B3B3] text-sm mb-1">Email</p>
          <p className="text-[#f9f7f4]">{email}</p>
        </div>
        <div>
          <p className="text-[#B3B3B3] text-sm mb-1">Phone</p>
          <p className="text-[#f9f7f4]">{phone}</p>
        </div>
      </div>

      {/* Associated Events */}
      <div className="mb-4">
        <p className="text-[#B3B3B3] text-sm mb-2">Associated Events</p>
        <div className="flex flex-wrap gap-2">
          {associatedEvents.slice(0, 2).map((event, index) => (
            <span
              key={index}
              className="bg-[#27272A] text-[#D4D4D8] text-sm px-3 py-1 rounded"
            >
              {event.name}
            </span>
          ))}
          {associatedEvents.length > 2 && (
            <span className="bg-[#2a2a2a] text-gray-400 text-sm px-3 py-1 rounded">
              +{associatedEvents.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Activation Notes */}
      <div className='border-t border-[#2a2a2a] pt-4'>
        <p className="text-[#b3b3b3] text-sm mb-1">Activation Notes</p>
        <p className="text-[#f9f7f4] text-sm leading-relaxed">{activationNotes}</p>
      </div>
    </div>
  );
};

export default PartnerCard;