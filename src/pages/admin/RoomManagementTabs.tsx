import { useState } from "react";
import { Building2, DoorOpen, Tags } from "lucide-react";
import BuildingManager from "./BuildingManager";
import RoomTypeManager from "./RoomTypeManager";
import RoomManager from "./RoomManager";

export default function RoomManagementTabs() {
  const [activeTab, setActiveTab] = useState<
    "rooms" | "roomTypes" | "buildings"
  >("rooms");

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "rooms"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <DoorOpen className="w-5 h-5" />
            Danh sách Phòng
          </button>

          <button
            onClick={() => setActiveTab("roomTypes")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "roomTypes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Tags className="w-5 h-5" />
            Loại Phòng
          </button>

          <button
            onClick={() => setActiveTab("buildings")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
              activeTab === "buildings"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
            }`}
          >
            <Building2 className="w-5 h-5" />
            Tòa nhà
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === "rooms" && <RoomManager />}
        {activeTab === "roomTypes" && <RoomTypeManager />}
        {activeTab === "buildings" && <BuildingManager />}
      </div>
    </div>
  );
}
