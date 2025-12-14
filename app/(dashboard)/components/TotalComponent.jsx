import { IoMdHome } from "react-icons/io";
import { FaEnvelope } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import DashboardSection from './DashboardSection';

export default function DashboardCards() {
  return (
    <>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      
      {/* Card 1 */}
      <div className="border border-gray-200 p-6 rounded-md bg-white">
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Total Listings</h1>
          <div className="bg-blue-200 p-1.5 rounded-md">
            <IoMdHome size={25} color="blue" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl mt-4 font-bold">124</h1>
        <div className="flex gap-2 mt-2 items-center">
          <FaArrowUpLong color="green" size={18} />
          <h3 className="text-green-600 text-sm md:text-base">4.2 %</h3>
        </div>
      </div>

      {/* Card 2 */}
      <div className="border border-gray-200 p-6 rounded-md bg-white">
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">New Inquiries</h1>
          <div className="bg-blue-200 p-2 rounded-md">
            <FaEnvelope size={25} color="blue" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl mt-4 font-bold">18</h1>
        <div className="flex gap-2 mt-2 items-center">
          <FaArrowUpLong color="green" size={18} />
          <h3 className="text-green-600 text-sm md:text-base">4.2 %</h3>
        </div>
      </div>

      {/* Card 3 */}
      <div className="border border-gray-200 p-6 rounded-md bg-white">
        <div className="flex justify-between">
          <h1 className="text-xl md:text-2xl font-semibold">Saved Properties</h1>
          <div className="bg-blue-200 p-2 rounded-md">
            <FaRegHeart size={25} color="blue" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl mt-4 font-bold">56</h1>
        <div className="flex gap-2 mt-2 items-center">
          <FaArrowDownLong color="red" size={18} />
          <h3 className="text-red-600 text-sm md:text-base">-2.4 %</h3>
        </div>
      </div>

      

    </div>

    <DashboardSection />
    </>
  );
}
