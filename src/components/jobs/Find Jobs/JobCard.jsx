import { Bookmark, MapPin, SendHorizontal, Slash } from "lucide-react";
import { formatReadableDate } from "../../../services/utils/function";

const JobCard = ({ job }) => {
  // console.log(job);
  const formattedDate = formatReadableDate(job?.createdAt)
  return (
    <div className="border border-gray-400 rounded-xl p-4 shadow-sm hover:shadow-gray-500 transition w-[100%] relative bg-white cursor-pointer">
      <div className="flex gap-2 mb-2">
        <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded">
          {/* {job.jobType} */}
          {formattedDate}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 hover:underline cursor-pointer">
        {job.jobTitle}
      </h2>

      <p className="text-gray-600 mt-2 mb-2">{job.postedBy.companyName}</p>
      <p className="text-gray-600 flex gap-1"><MapPin />{job.location}</p>

      <div className="flex gap-2 mt-2">
        <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-md">
          {job.MinimumSalary} - {job.MaximumSalary}
        </span>
        <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-md">
          {job.jobType}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 text-blue-600 font-medium cursor-pointer">
        <span className="text-xl"><SendHorizontal className="w-5" /></span> Easily apply
      </div>

      <div className="absolute top-3 right-3 flex gap-2">
        {/* <Bookmark className="w-4 h-4 text-gray-500 cursor-pointer hover:text-blue-600" /> */}
        {/* <Slash className="w-4 h-4 text-gray-500 cursor-pointer hover:text-red-600" /> */}
      </div>
    </div>
  );
};

export default JobCard;
