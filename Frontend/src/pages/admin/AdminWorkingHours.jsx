import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";

import { getStaff, getStaffById } from "../../api/staff.api";
import { createWorkingHour } from "../../api/availability.api";

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const createDefaultSchedule = () => {
  return days.reduce((acc, day) => {
    acc[day.value] = {
      dayOfWeek: day.value,
      startTime: "09:00",
      endTime: "18:00",
      isAvailable: day.value !== 0, // Sunday off by default
    };
    return acc;
  }, {});
};

export default function AdminWorkingHours() {
  const [staff, setStaff] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [schedule, setSchedule] = useState(createDefaultSchedule());

  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [savingDay, setSavingDay] = useState(null);
  const [savingAll, setSavingAll] = useState(false);

  const loadStaff = async () => {
    try {
      setLoadingStaff(true);
      const data = await getStaff();
      setStaff(data.staff || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load staff");
    } finally {
      setLoadingStaff(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const loadWorkingHours = async (staffId) => {
    if (!staffId) {
      setSchedule(createDefaultSchedule());
      return;
    }

    try {
      setLoadingSchedule(true);
      const data = await getStaffById(staffId);
      const existingHours = data.staff?.WorkingHours || [];
      const newSchedule = createDefaultSchedule();

      existingHours.forEach((wh) => {
        newSchedule[wh.dayOfWeek] = {
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime ? wh.startTime.slice(0, 5) : "09:00",
          endTime: wh.endTime ? wh.endTime.slice(0, 5) : "18:00",
          isAvailable: Boolean(wh.isAvailable),
        };
      });

      setSchedule(newSchedule);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load working hours");
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleStaffChange = async (e) => {
    const staffId = e.target.value;
    setSelectedStaffId(staffId);
    await loadWorkingHours(staffId);
  };

  const handleScheduleChange = (dayOfWeek, field, value) => {
    setSchedule((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        [field]: value,
      },
    }));
  };

  const handleAvailabilityChange = (dayOfWeek, isAvailable) => {
    setSchedule((prev) => ({
      ...prev,
      [dayOfWeek]: {
        ...prev[dayOfWeek],
        isAvailable,
      },
    }));
  };

  const validateDay = (day) => {
    if (day.isAvailable && day.startTime >= day.endTime) {
      const dayName = days.find((d) => d.value === day.dayOfWeek)?.label;
      alert(`For ${dayName}: End time must be later than start time.`);
      return false;
    }
    return true;
  };

  const handleSaveDay = async (dayOfWeek) => {
    if (!selectedStaffId) {
      alert("Please select a staff member");
      return;
    }

    const day = schedule[dayOfWeek];
    if (!validateDay(day)) return;

    try {
      setSavingDay(dayOfWeek);
      await createWorkingHour({
        staffId: Number(selectedStaffId),
        dayOfWeek: Number(day.dayOfWeek),
        startTime: day.startTime,
        endTime: day.endTime,
        isAvailable: day.isAvailable,
      });

      const dayLabel = days.find((item) => item.value === dayOfWeek)?.label;
      alert(`${dayLabel} schedule saved successfully`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save working hours");
    } finally {
      setSavingDay(null);
    }
  };

  const handleSaveAll = async () => {
    if (!selectedStaffId) {
      alert("Please select a staff member");
      return;
    }

    // Validate all enabled days first
    for (const day of Object.values(schedule)) {
      if (!validateDay(day)) return;
    }

    try {
      setSavingAll(true);
      await Promise.all(
        Object.values(schedule).map((day) =>
          createWorkingHour({
            staffId: Number(selectedStaffId),
            dayOfWeek: Number(day.dayOfWeek),
            startTime: day.startTime,
            endTime: day.endTime,
            isAvailable: day.isAvailable,
          }),
        ),
      );

      alert("Full weekly schedule saved successfully!");
      await loadWorkingHours(selectedStaffId);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save all schedules");
    } finally {
      setSavingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
                Admin Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold text-stone-900">
                Working Hours
              </h1>
              <p className="mt-2 text-stone-500">
                Configure when each staff member is available for appointments.
              </p>
            </div>

            {selectedStaffId && (
              <button
                type="button"
                onClick={handleSaveAll}
                disabled={savingAll || loadingSchedule}
                className="rounded-xl bg-amber-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-50"
              >
                {savingAll ? "Saving Week..." : "Save Entire Week"}
              </button>
            )}
          </div>

          {/* Staff Selector */}
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-stone-700">
              Select Staff Member
            </label>

            <select
              value={selectedStaffId}
              onChange={handleStaffChange}
              disabled={loadingStaff}
              className="w-full rounded-lg border border-stone-300 bg-white p-3 outline-none focus:border-stone-900"
            >
              <option value="">
                {loadingStaff ? "Loading staff..." : "Select a staff member"}
              </option>

              {staff.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                  {member.specialization ? ` — ${member.specialization}` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule List */}
          {selectedStaffId && (
            <div className="mt-8">
              {loadingSchedule ? (
                <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
                  <p className="text-stone-500">Loading working hours...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {days.map((day) => {
                    const currentDay = schedule[day.value];

                    return (
                      <div
                        key={day.value}
                        className={`rounded-2xl bg-white p-6 shadow-sm transition ${
                          !currentDay.isAvailable ? "opacity-75" : ""
                        }`}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                          {/* Day Column */}
                          <div className="w-36">
                            <h2 className="text-lg font-bold text-stone-900">
                              {day.label}
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">
                              {currentDay.isAvailable ? "Available" : "Day off"}
                            </p>
                          </div>

                          {/* Working Toggle */}
                          <div className="flex items-center gap-3">
                            <label className="relative inline-flex cursor-pointer items-center">
                              <input
                                type="checkbox"
                                checked={currentDay.isAvailable}
                                onChange={(e) =>
                                  handleAvailabilityChange(
                                    day.value,
                                    e.target.checked,
                                  )
                                }
                                className="peer sr-only"
                              />
                              <div className="h-6 w-11 rounded-full bg-stone-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-stone-300 after:bg-white after:transition-all peer-checked:bg-stone-900 peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                            </label>
                            <span className="text-sm font-medium text-stone-700">
                              Working
                            </span>
                          </div>

                          {/* Time Inputs */}
                          {currentDay.isAvailable ? (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                              <div>
                                <label className="mb-1 block text-xs font-medium text-stone-500">
                                  Start
                                </label>
                                <input
                                  type="time"
                                  value={currentDay.startTime}
                                  onChange={(e) =>
                                    handleScheduleChange(
                                      day.value,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-stone-300 p-2.5 text-sm outline-none focus:border-stone-900"
                                />
                              </div>

                              <span className="hidden pt-5 text-stone-400 sm:block">
                                →
                              </span>

                              <div>
                                <label className="mb-1 block text-xs font-medium text-stone-500">
                                  End
                                </label>
                                <input
                                  type="time"
                                  value={currentDay.endTime}
                                  onChange={(e) =>
                                    handleScheduleChange(
                                      day.value,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                  className="rounded-lg border border-stone-300 p-2.5 text-sm outline-none focus:border-stone-900"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="flex-1 text-sm italic text-stone-400">
                              Off duty
                            </div>
                          )}

                          {/* Single Day Save Button */}
                          <button
                            type="button"
                            onClick={() => handleSaveDay(day.value)}
                            disabled={savingDay === day.value || savingAll}
                            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
                          >
                            {savingDay === day.value ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!selectedStaffId && (
            <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold text-stone-800">
                Select a staff member
              </h2>
              <p className="mt-2 text-stone-500">
                Choose a staff member above to configure their weekly working
                schedule.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
