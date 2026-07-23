
import DynamicTable from "./shared/Tabel/DynamicTable"
import getNestedValue from "./hooks/pubFunc/getNestedValue";
import { toShamsi } from "./hooks/pubFunc/dateController";
// import api from "./api/api";
// import toast from "react-hot-toast";
import { useRef, useState } from "react";
type CustomRenderersType = Record<string, (val: any, row: any) => React.ReactNode>;
type Metadata = {
  type: string;
};
function ManageSession() {
  const [refFlage, setrefFlage] = useState<boolean>(false);
  const downloadingRef = useRef<Set<string>>(new Set());
const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const columns = [
    { header: "نام", accessor: "name", showSearch: false },
    { header: "تاریخ جلسه", accessor: "createdAt", showSearch: false },
    { header: "نوع جلسه", accessor: "metadata", showSearch: false },
    { header: "عملیات", accessor: "mession", showSearch: false },
  ];
 const downloadSession = async (livekitRoomName: string) => {
  if (downloadingRef.current.has(livekitRoomName)) return; 
  
  downloadingRef.current.add(livekitRoomName);
  window.open(`https://asaflive.ir/api/session-manager/download/${livekitRoomName}`,'_blank')
  setDownloadingIds(new Set(downloadingRef.current));

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
    mession: (_, element) => {
      const roomName = element?.metadata?.livekitRoomName;
      const isDownloading = downloadingIds.has(roomName);

      return (
        <div>
          <button
            disabled={isDownloading}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm rounded transition-colors cursor-pointer"
            onClick={() => { downloadSession(roomName)}}
          >
            {isDownloading ? "در حال دانلود..." : "دانلود جلسه"}
          </button>
        </div>
      );
    }
  };
  return (
    <div className="flex justify-center items-center flex-col h-screen">
      <h1 className="text-5xl text-white font-extrabold mb-4">مدیریت جلسات</h1>
      <div className="w-11/12">
        <DynamicTable
          apiEndpoint="/session-manager"
          columns={columns}
          refreshFlag={refFlage}
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