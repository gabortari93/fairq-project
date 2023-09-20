import dayjs from "dayjs";

export default function InvitedTeamMember({ membership, onCancelInvite }) {
  return (
    <div className="bg-base-200 container flex border border-neutral-300 rounded-lg w-full h-fit md:h-20 mt-5 items-center justify-between p-4 shadow-base-300 hover:shadow-lg ease-in-out transition-all duration-200">
      <div className="overflow-hidden truncate">{membership.member.user.email}</div>
      <div className="flex flex-col md:flex-row items-center justify-between md:content-end gap-2 md:w-fit pl-2">
        <div className="opacity-50 text-xs sm:text-sm md:text-md w-full md:w-fit text-center">
          {dayjs().to(dayjs(membership.created_date))}
        </div>
        <button
          className="btn btn-outline btn-sm btn-error rounded w-full md:w-fit"
          onClick={(e) => onCancelInvite(membership.member.user.id)}
        >
          Cancel invite
        </button>
      </div>
    </div>
  );
}
