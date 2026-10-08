import React, { useEffect, useState } from "react";
import useStaffStore from "../store/staff.store"; // Adjust this import path to your project layout
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Staff = () => {
  const {
    staff,
    loading,
    error,
    fetchStaff,
    fetchStaffById,
    selectedStaff,
    clearSelectedStaff,
  } = useStaffStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🚀 Fetch all 10 staff members automatically when the component mounts
  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // 🔍 Handle clicking on a staff card to drill down into their specific details
  const handleViewProfile = async (id) => {
    await fetchStaffById(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    clearSelectedStaff();
    setIsModalOpen(false);
  };

  // 🛠️ Helper function to safely extract up to 2 initials from names
  const getInitials = (nameString) => {
    if (!nameString) return "L";
    const parts = nameString.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#121212] py-8 px-4 sm:px-6 lg:px-8 text-gray-100 selection:bg-amber-400 selection:text-black">
        {/* Header Banner */}
        <div className="max-w-7xl mx-auto mb-10 text-center md:text-left md:flex md:items-center md:justify-between border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-tight sm:text-4xl uppercase">
              Meet Our Master Artisans
            </h1>
            <p className="mt-2 text-md text-zinc-400 font-light tracking-wide">
              Elite stylists and specialized treatment experts defining the
              beauty standards at Lumière Salon.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 ring-1 ring-inset ring-amber-400/20 tracking-wider uppercase">
              {staff.length} Masters On-Duty
            </span>
          </div>
        </div>

        {/* ⏳ Luxury Loading Skeleton Loader */}
        {loading && !isModalOpen && (
          <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-[#1a1a1a] rounded-2xl h-64 p-6 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="rounded-full bg-zinc-800 h-20 w-20 mx-auto mb-4 border border-zinc-700"></div>
                  <div className="h-4 bg-zinc-800 rounded w-3/4 mx-auto mb-3"></div>
                  <div className="h-3 bg-zinc-800 rounded w-1/2 mx-auto mb-4"></div>
                </div>
                <div className="h-9 bg-zinc-800 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* ⚠️ Error Alert Dialog */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 rounded-xl bg-red-950/40 p-4 border border-red-900/50">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-red-400">
                  Database Connection Timeout
                </h3>
                <p className="mt-1 text-sm text-red-300/80">{error}</p>
                <button
                  onClick={() => fetchStaff()}
                  className="mt-3 text-sm font-bold text-amber-400 underline hover:text-amber-300 transition-colors"
                >
                  Reconnect Infrastructure
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 👥 Empty State View */}
        {!loading && staff.length === 0 && !error && (
          <div className="text-center max-w-md mx-auto py-16 border border-dashed border-zinc-800 rounded-2xl bg-[#1a1a1a]">
            <p className="text-zinc-500 text-md tracking-wide">
              No stylists found in the system registry.
            </p>
          </div>
        )}

        {/* 👥 Main Staff Grid Content */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {staff.map((member) => (
            <div
              key={member.id}
              className="group relative bg-[#1a1a1a] rounded-2xl border border-zinc-800 shadow-xl hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Visual Gold Accent Banner Bar */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-600 opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="p-6 text-center flex-grow">
                {/* Profile Avatar with Initials */}
                <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center text-amber-400 text-xl font-bold border border-zinc-700 shadow-inner group-hover:border-amber-400/60 group-hover:scale-105 transition-all duration-300">
                  {getInitials(member.name)}
                </div>

                <h3 className="mt-4 text-lg font-bold text-gray-100 group-hover:text-amber-400 transition-colors tracking-wide">
                  {member.name}
                </h3>

                <p className="text-xs font-semibold text-amber-400/90 tracking-widest uppercase mt-1">
                  {member.specialization}
                </p>

                <p className="mt-4 text-xs text-zinc-400 font-light leading-relaxed px-2 line-clamp-2 italic">
                  "
                  {member.experience ||
                    "Vetted artisan trained in contemporary styles."}
                  "
                </p>
              </div>

              {/* Actions Panel Block */}
              <div className="bg-[#151515] px-6 py-4 border-t border-zinc-800/80">
                <button
                  onClick={() => handleViewProfile(member.id)}
                  className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-zinc-700 text-xs font-semibold tracking-wider uppercase rounded-xl text-gray-300 bg-zinc-900 hover:bg-zinc-800 hover:border-amber-400 hover:text-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all duration-200"
                >
                  View Profile & Services
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 🪟 Detailed Staff View Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#181818] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-zinc-800 transform transition-all">
              {/* Modal Header */}
              <div className="relative bg-[#111111] p-6 text-white border-b border-zinc-800">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-amber-400 bg-zinc-900/60 p-2 rounded-full border border-zinc-800 hover:border-amber-400/20 text-xs font-bold transition-all"
                >
                  ✕
                </button>
                {selectedStaff ? (
                  <>
                    <h2 className="text-xl font-bold tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-400">
                      {selectedStaff.name}
                    </h2>
                    <p className="text-zinc-400 text-xs tracking-wider font-medium uppercase mt-0.5">
                      {selectedStaff.specialization}
                    </p>
                  </>
                ) : (
                  <h2 className="text-md font-bold tracking-wider text-zinc-400 uppercase">
                    Syncing Server Matrix...
                  </h2>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm text-gray-500">
                      Retrieving extended database files...
                    </p>
                  </div>
                ) : selectedStaff ? (
                  <div className="space-y-4">
                    {/* Detailed Experience Block */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Professional Journey
                      </h4>
                      <p className="mt-1 text-gray-700 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                        {selectedStaff.experience}
                      </p>
                    </div>

                    {/* Metadata Core Matrix Grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Email Address
                        </h4>
                        <p className="mt-0.5 text-sm font-medium text-gray-800 break-words">
                          {selectedStaff.email}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Contact Number
                        </h4>
                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                          {selectedStaff.phone}
                        </p>
                      </div>
                    </div>

                    {/* System Operational Flags */}
                    <div className="flex items-center justify-between text-sm bg-gray-50 px-4 py-3 rounded-xl">
                      <span className="font-medium text-gray-600">
                        Booking Status
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold ${
                          selectedStaff.isActive
                            ? "bg-green-50 text-green-700 ring-1 ring-green-600/20"
                            : "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20"
                        }`}
                      >
                        {selectedStaff.isActive
                          ? "● Available For Hire"
                          : "○ Off-Duty"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-6">
                    Could not pull profile mapping data.
                  </p>
                )}
              </div>

              {/* Modal Actions Footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
                <button
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-900 text-white font-medium text-sm rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Staff;
