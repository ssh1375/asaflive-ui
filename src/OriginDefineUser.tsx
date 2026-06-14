// components/OriginDefineUser.tsx
import { useState } from "react";
import TextInput from "./shared/Forms/TextInput";
import toast from 'react-hot-toast';
import { userSchema, type UserData } from "./hooks/validation/create-origin-user";
import DynamicTable from "./shared/Tabel/DynamicTable";
import getNestedValue from "./hooks/pubFunc/getNestedValue";
import api from "./hooks/req/api/api";

type Errors = Partial<Record<keyof UserData, string>>;

export interface UserData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
}

const EMPTY_USER: UserData = {
  email: "",
  phone: "",
  password: "",
  firstName: "",
  lastName: "",
};

interface OriginDefineUserProps {
  initialValue?: UserData;
  onSubmit?: (user: UserData) => void;
}
type CustomRenderersType = Record<string, (val: any, row: any) => React.ReactNode>;


export default function OriginDefineUser({
  initialValue = EMPTY_USER,
  onSubmit,
}: OriginDefineUserProps) {
  const [user, setUser] = useState<UserData>(initialValue);
  const [errors, setErrors] = useState<Errors>({});
  const [refFlage, setrefFlage] = useState<boolean>(false);

  const customRenderers: CustomRenderersType = {
    // مثال: اگر خواستید ستون شماره تلفن چپ‌چین و با فونت متفاوت باشد
    phone: (value: string) => (
      <span className="font-mono text-blue-400" dir="ltr">{value}</span>
    ),
    // می‌توانید برای ستون‌های دیگر هم اینجا تابع بنویسید
  };

  const columns = [
    { header: "نام", accessor: "firstName" },
    { header: "نام خانوادگی", accessor: "lastName" },
    { header: "شماره همراه", accessor: "phone" },

  ];

  const updateField = (field: keyof UserData) => (value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  const validate = (): boolean => {
    const result = userSchema.safeParse(user);
    if (result.success) {
      setErrors({});
      return true;
    }
    const fieldErrors: Errors = {};
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof UserData;
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    setErrors(fieldErrors);
    return false;
  };

  const handleSubmit = () => {
    // onSubmit?.(user);
    console.log(user);
    
    if (validate()) {
      api.post("/users",user).then((res)=>{
        setrefFlage(true)
        toast.success('اطلاعات با موفقیت ذخیره شد!')
      }).catch((err)=>{
        toast.error("خطایی در ساخت کاربر رخ داده است")
      }).finally(()=>setrefFlage(false))
    }

  };

  return (

    <div className="flex items-center flex-col justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-3xl bg-black/60 border border-blue-500/30 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
        <h2 className="text-white text-lg font-semibold">تعریف کاربر جدید</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput
            value={user.firstName}
            onValueChange={updateField("firstName")}
            placeholder="نام"
            error={errors.firstName}
          />
          <TextInput
            value={user.lastName}
            onValueChange={updateField("lastName")}
            placeholder="نام خانوادگی"
            error={errors.lastName}
          />
        </div>



        <TextInput
          type="email"
          value={user.email}
          onValueChange={updateField("email")}
          placeholder="ایمیل"
          error={errors.email}
        />

        <TextInput
          type="tel"
          value={user.phone}
          onValueChange={updateField("phone")}
          placeholder="شماره تلفن"
          dir="ltr"
          error={errors.phone}
        />

        <TextInput
          type="password"
          value={user.password}
          onValueChange={updateField("password")}
          placeholder="رمز عبور"
          error={errors.password}
        />

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-4 py-2 rounded cursor-pointer"
        >
          ذخیره کاربر
        </button>
      </div>
      <div className="w-11/12">
        <DynamicTable
          apiEndpoint="/users/"
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




  );
}
