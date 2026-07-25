
import DynamicTable from "./shared/Tabel/DynamicTable"
import getNestedValue from "./hooks/pubFunc/getNestedValue";
import { toShamsi } from "./hooks/pubFunc/dateController";
// import api from "./api/api";
// import toast from "react-hot-toast";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import api from "./api/api";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import api from "./api/api";
type CustomRenderersType = Record<string, (val: any, row: any) => React.ReactNode>;
type Metadata = {
  type: string;
};
function ManageSession() {
  const downloadingRef = useRef<Set<string>>(new Set());

  const columns = [
    { header: "نام", accessor: "name", showSearch: false },
    { header: "تاریخ جلسه", accessor: "createdAt", showSearch: false },
    { header: "نوع جلسه", accessor: "metadata", showSearch: false },
    { header: "دانلود جلسه", accessor: "download_session", showSearch: false },
    { header: "ورود به جلسه", accessor: "join_room", showSearch: false },
  ];
  const downloadSession = async (livekitRoomName: string) => {
    downloadingRef.current.add(livekitRoomName);
    window.open(`https://asaflive.ir/api/session-manager/download/${livekitRoomName}`, '_blank')
  };
  const navigate = useNavigate();

    const checkEgressStatus = async (egressId?: string) => {
    if (!egressId) return true; 

    try {
      const res = await api.get(`/session-manager/meeting/${egressId}`);
      
      if (res.data === false) {
        toast.error('ضبط متوقف شده است و امکان ورود به این جلسه وجود ندارد.');
        return false;
      }
      
      return res.data; 
    } catch (error) {
      console.error("خطا در چک کردن وضعیت خروجی:", error);
      toast.error("خطا در استعلام وضعیت جلسه");
      return false;
    }
  };

  const getToken = async (id?: string, egressId?: string): Promise<string | null> => {
    const isEgressActive = await checkEgressStatus(egressId);
    
    if (!isEgressActive) return null;

    const toastId = toast.loading("در حال دریافت توکن و ساخت دعوتنامه...");
    
    try {
      const userRes = await api.get("/auth/me");
      const user = userRes.data;

      const displayName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim();

      const inviteRes = await api.post(`/session-manager/invite/${id}`, {
        phone: user.phone,
        displayName: displayName || "پشتیبان",
        permissions: { roomJoin: true, canPublish: true, canSubscribe: true }
      });

      toast.success("توکن با موفقیت ساخته شد", { id: toastId });

      const token = inviteRes.data?.accessToken;
      
      navigate(`/session/${id}?token=${token}&egressId=${egressId}`, { 
        state: { egress: egressId } 
      });
      
      return token;

    } catch (error: any) {
      console.error("خطا در استعلام کاربر یا ساخت توکن:", error);
      toast.error("خطا در ساخت توکن", { id: toastId });
      return null; 
    }
  };



  const customRenderers: CustomRenderersType = {
    name: (value: string) => {
      if (value) {
        const result = value.split(":");
        return (
          <span className="font-mono text-blue-400" dir="ltr">
            {result[0]}
          </span>
        );
      }
    },
    metadata: (value: Metadata) => {
      let typeSession = ""
      switch (value?.type) {
        case "CARGO_DAMAGE":
          typeSession = "خسارت"
          break;
        case "INSURANCE_VISIT":
          typeSession = "بازدید"
          break;
        case "SIMPLE_MEETING":
          typeSession = "دورهمی"
          break;

        default:
          typeSession = "_"
          break;
      }
      return (
        <span>
          {typeSession}
        </span>
      )
    },
    createdAt: (value: string) => {
      return (<span>{toShamsi(value)}</span>)
    },
    download_session: (_, element) => {
      const roomName = element?.metadata?.livekitRoomName;
      return (
        <button
          className="px-3 py-1  bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
          onClick={() => { downloadSession(roomName) }}
        >
          دانلود جلسه
        </button>
      );
    },
    join_room: (_, element) => {
      const meetingRoom = element?.id;
      let res = element?.egressdata ? JSON.parse(element?.egressdata) : ''
      console.log("XXXX", res);
      return (
        <button
          className="px-3 py-1  bg-yellow-600 hover:bg-yellow-500 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
          onClick={() => {
            console.log(meetingRoom);
            getToken(meetingRoom, res?.egressId)
          }}
        >
          ورود به جلسه
        </button>
      );
    }
  };
  return (
    <div className="flex justify-center items-center flex-col min-h-screen">
      <h1 className="text-5xl text-white font-extrabold mb-4">مدیریت جلسات</h1>
      <div className="w-11/12">
        <DynamicTable
          apiEndpoint="/session-manager"
          columns={columns}
          recordsPerPage={10}

          customRender={(row, colIndex) => {
            const col = columns[colIndex];
            if (col && customRenderers[col.accessor]) {
              return customRenderers[col.accessor](row[col.accessor], row);
            } else {
              const value = getNestedValue(row, col.accessor);
              return value || '-';
            }
          }}
        />
      </div>
    </div>
  )
}

export default ManageSession