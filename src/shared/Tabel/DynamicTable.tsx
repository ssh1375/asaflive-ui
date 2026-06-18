import React, { useEffect, useState } from "react";
import { DataTable, type DataTableStateEvent, type DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { Column } from "primereact/column";
import api from "../../api/api";
import moment from "moment-jalaali";
import PersianDigits from "../PersianText";
// import { toShamsi } from "../../../utils/dateUtils";
import { toEnglishDigits } from "../../hooks/pubFunc/formatNumber";
import Loader from "../Loading/Loader";
import toast from "react-hot-toast";

export interface ColumnConfig<T = any> {
    header: string;
    accessor: string;
    type?: string;
    width?: string;
    showSearch?: boolean;
    renameSearch?: string;
    customSearch?: React.ReactNode;
    customFilter?: Record<string, any>;
}

interface DynamicTableProps<T = any> {
    apiEndpoint?: string;
    columns: ColumnConfig<T>[];
    haveVales?: boolean;
    primaryKey?: string;
    customRender?: (rowData: T, index: number) => React.ReactNode;
    showReq?: number;
    recordsPerPage?: number;
    contractId?: string | number;
    refreshFlag?: boolean;
    searchData?: T[];
    lastPage?: number;
    total?: number;
    totalPages?: number;
}

interface PaginationState {
    lastPage: number;
    total: number;
    totalPages: number;
    limit: number;
    page: number;
}

const DynamicTable = <T extends Record<string, any>>({
    apiEndpoint,
    columns,
    haveVales,
    customRender,
    primaryKey = "id",
    showReq = 8,
    recordsPerPage = 8,
    contractId,
    refreshFlag,
    searchData = [],
    lastPage: initialLastPage = 0,
    total: initialTotal = 0,
    totalPages: initialTotalPages = 0
}: DynamicTableProps<T>) => {


    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [columnFilters, setColumnFilters] = useState<Record<string, string | number>>({});
    const [debouncedFilters, setDebouncedFilters] = useState<Record<string, string | number>>(columnFilters);

    const [pagination, setPagination] = useState<PaginationState>({
        lastPage: initialLastPage,
        total: initialTotal,
        totalPages: initialTotalPages,
        limit: recordsPerPage,
        page: 1
    });

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [first, setFirst] = useState<number>(0);

    const [rowsPerPage, setRowsPerPage] = useState<number>(recordsPerPage);
    const [selectedRow, setSelectedRow] = useState<T | null>(null);


    const getNestedValue = (row: Record<string, any>, accessor: string): any => {
        try {
            return accessor.split(".").reduce((acc, key) => acc && acc[key], row);
        } catch {
            return undefined;
        }
    };

    const displayValue = (val: any): string | number => {
        if (val === null || val === undefined) return "-";
        if (typeof val === "string" && val.trim() === "") return "-";
        return val;
    };

    const formatCurrency = (num: number | string | null | undefined): string => {
        if (num == null) return "-";
        const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
        if (isNaN(parsedNum)) return String(num);
        return new Intl.NumberFormat("fa-IR").format(parsedNum);
    };

    const convertToJalaliDate = (gregorianDate: string | Date | null | undefined): string => {
        if (!gregorianDate) return "-";
        return moment(gregorianDate).format("jYYYY/jMM/jDD");
    };

    useEffect(() => {
        const qp = new URLSearchParams(window.location.search).get('page');
        const p = qp ? parseInt(qp, 10) : 1;
        setCurrentPage(p);
        setFirst((p - 1) * rowsPerPage);
    }, [rowsPerPage]);

    useEffect(() => {
        const combined = (columns || []).reduce((acc, c) => {
            if (c && c.customFilter && typeof c.customFilter === 'object') {
                return { ...acc, ...c.customFilter };
            }
            return acc;
        }, {} as Record<string, any>);

        if (Object.keys(combined).length === 0) return;

        setColumnFilters(prev => {
            const prevStr = JSON.stringify(prev || {});
            const next = { ...prev, ...combined };
            const nextStr = JSON.stringify(next);
            if (prevStr === nextStr) {
                return prev;
            }
            return next;
        });
    }, [columns]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedFilters(prev => {
                const prevStr = JSON.stringify(prev || {});
                const nextStr = JSON.stringify(columnFilters || {});
                if (prevStr === nextStr) return prev;
                return columnFilters;
            });
        }, 400);

        return () => clearTimeout(handler);
    }, [columnFilters]);

    useEffect(() => {
        let isMounted = true;
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;

        interface BuildQueryParams {
            page?: number;
            limit?: number;
            filters?: Record<string, any>;
            extra?: Record<string, any>;
        }

        const buildQuery = ({ page, limit, filters = {}, extra = {} }: BuildQueryParams): string => {
            const params = new URLSearchParams();

            if (page != null) params.set('page', String(page));
            if (limit != null) params.set('limit', String(limit));

            Object.entries(filters).forEach(([field, value]) => {
                if (value !== undefined && value !== null && `${value}`.trim() !== '') {
                    params.append(`${field}`, String(value));
                }
            });

            Object.entries(extra).forEach(([k, v]) => {
                if (v !== undefined && v !== null && `${v}`.toString().trim() !== '') {
                    params.set(k, String(v));
                }
            });

            return params.toString();
        };

        const fetchData = async () => {
            if (!apiEndpoint) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const isServerSide = !!apiEndpoint;
                let url = `${apiEndpoint}`;

                if (isServerSide) {
                    const qs = buildQuery({
                        page: currentPage,
                        limit: rowsPerPage,
                        filters: debouncedFilters,
                        extra: { contractId }
                    });
                    url = qs ? `${apiEndpoint}?${qs}` : apiEndpoint;
                }

                const axiosConfig: any = {};
                if (controller && controller.signal) axiosConfig.signal = controller.signal;

                // const response = await api.get(url, axiosConfig);

                const response = await api.get(url, axiosConfig);

                console.log(response)
                const body = response.data;

                // const raw =
                //     Array.isArray(body?.data) ? body.data :
                //         Array.isArray(body?.data?.data) ? body.data.data :
                //             [];
                let raw = [];
                if (Array.isArray(body)) {
                    raw = body;
                } else if (Array.isArray(body?.data)) {
                    raw = body.data;
                } else if (Array.isArray(body?.data?.data)) {
                    raw = body.data.data;
                } else if (Array.isArray(body?.items)) {
                    raw = body.items;
                }

                if (!isMounted) return;
                setData(raw);

                const count = Array.isArray(body) ? body.length : (body?.count ?? body?.total ?? body?.totalRecords ?? 0);
                const totalPages = Math.ceil(count / rowsPerPage) || 1;
                const page = body?.page ?? currentPage;
                const limit = body?.limit ?? rowsPerPage;

                if (isMounted) {
                    setPagination((prev) => ({
                        ...prev,
                        total: count,
                        totalPages: totalPages,
                        page: page,
                        limit: limit
                    }));

                    setFirst((page - 1) * limit);
                }
            } catch (error: any) {
                const isAbort = error?.name === 'CanceledError' || error?.name === 'AbortError';
                if (!isAbort) {
                    console.error("خطا در دریافت اطلاعات:", error);
                    if (isMounted) setData([]);
                }
                toast.error('!مشکلی در دریافت اطلاعات رخ داد')

            } finally {
                if (isMounted) setLoading(false);
            }
        };

        if (!haveVales) {
            fetchData();
        } else {
            setLoading(false);
        }

        return () => {
            isMounted = false;
            try {
                controller?.abort?.();
            } catch (e) {
                console.error("خطا در لغو درخواست:", e);
            }
        };
    }, [apiEndpoint, contractId, refreshFlag, currentPage, rowsPerPage, debouncedFilters, haveVales]);

    // 5. نوع‌دهی به رویدادهای PrimeReact
    const onPageChange = (event: DataTableStateEvent) => {
        // PrimeReact page events have `page` (0-indexed or 1-indexed based on version) and `first`
        const newPage = (event.page ?? 0) + 1;
        setFirst(event.first);
        setCurrentPage(newPage);
    };

    const AnotherProperty = {
        lazy: true,
        totalRecords: pagination.total,
        first,
        onPage: onPageChange
    };

    const renderCellValue = (rowData: T, col: ColumnConfig<T>, index: number) => {
        if (customRender) return customRender(rowData, index);
        const rawVal = getNestedValue(rowData, col.accessor);
        if (col.accessor.includes("date")) return convertToJalaliDate(rawVal);
        if (col.accessor.includes("amount") || col.accessor.includes("price")) return formatCurrency(rawVal);
        return displayValue(rawVal);
    };

    //   const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    //     const val = parseInt(e.target.value, 10);
    //     if (!val) return;
    //     setRowsPerPage(val);
    //     setCurrentPage(1);
    //     setFirst(0);
    //     setPagination((prev) => ({ ...prev, limit: val, page: 1 }));
    //   };

    const renderHeaderWithFilter = (col: ColumnConfig<T>) => {

        if (col.customSearch) {
            return (
                <div className="flex flex-col gap-1">
                    <div className="font-bold text-sm text-white whitespace-nowrap">{col.header}</div>
                    {col.customSearch}
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1">
                <div className="font-bold text-sm text-white whitespace-nowrap">{col.header}</div>
                <input
                    className={`outline-none text-center text-blue-600 text-sm px-2 py-1 rounded-md bg-bl-400 ${col.width ?? "w-[80%]"} mr-[10%] border font-medium border-bl-800 border-opacity-50 focus:border-bl-600 focus:ring-1 focus:ring-bl-800 ${col.showSearch === false ? "!hidden" : ""}`}
                    placeholder={`جستجو ${col.header}`}
                    value={columnFilters[col.renameSearch ?? col.accessor] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setColumnFilters(prev => ({
                            ...prev,
                            [col.renameSearch ?? col.accessor]: toEnglishDigits(e.target.value)
                        }));
                        setCurrentPage(1);
                    }}
                />
            </div>
        );
    };

    const rowsToShow = loading
        ? Array.from({ length: rowsPerPage }).map((_, i) => ({ id: `loading-row-${i}` } as any))
        : (haveVales ? searchData : data);


    return (
        <div className="w-full max-w-full p-4 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl rounded-3xl -z-10 group-hover:opacity-70 transition-opacity duration-500"></div>

            <div className="bg-slate-900/90 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.4)] p-5 border border-slate-700/50">

                <div className="bg-slate-800/40 rounded-2xl shadow-[inset_0_2px_15px_rgba(0,0,0,0.2)] border border-slate-600/30 ">
                    <div  className="overflow-x-auto custom-scroll">
                        <DataTable
                            value={rowsToShow}
                            paginator={true}
                            // totalRecords={pagination.total}
                            rows={pagination.limit}
                            scrollable
                            scrollHeight="flex"
                            {...AnotherProperty}
                            dataKey="id"
                            emptyMessage={
                                <div className="flex flex-col items-center justify-center py-10 opacity-70">
                                    <span className="text-slate-400 font-medium text-sm tracking-wide">
                                        داده‌ای برای نمایش یافت نشد
                                    </span>
                                </div>
                            }
                            selectionMode="single"
                            selection={selectedRow}
                            rowHover
                            className="p-datatable-sm w-full min-w-[700px] modern-dark-table"
                            onSelectionChange={(e: DataTableSelectionSingleChangeEvent<T[]>) => setSelectedRow(e.value as T)}
                            rowClassName={(rowData: T) => {
                                if (!selectedRow || !rowData) return 'border-b border-slate-700/30';

                                const isSelected = selectedRow && rowData && (selectedRow as any)[primaryKey] === (rowData as any)[primaryKey];

                                return isSelected
                                    ? 'bg-gradient-to-r from-indigo-900/60 to-slate-800/60 border-r-4 border-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.15)] text-indigo-100 font-medium'
                                    : 'border-b border-slate-700/30 hover:bg-slate-700/40 hover:shadow-lg transition-all duration-300 ease-in-out';
                            }}
                        >
                            {columns.map((col, index) => {
                                const headerContent = col.showSearch === false
                                    ? (
                                        <div className="font-bold text-sm text-white relative  px-2">
                                            {col.header}
                                        </div>
                                    )
                                    : renderHeaderWithFilter(col);

                                return (
                                    <Column
                                        key={index}
                                        field={col.accessor}
                                        header={headerContent}
                                        body={(rowData: T) => {
                                            if (!rowData) return <Loader />;

                                            let showDate = renderCellValue(rowData, col, index);
                                            switch (col.type) {
                                                case "date":
                                                    showDate = moment(showDate as string, "jYYYY/jMM/jDD").isValid()
                                                        ? moment(showDate as string).format("jYYYY/jMM/jDD _ HH:mm:ss")
                                                        : showDate;
                                                    break;
                                                default:
                                                    break;
                                            }

                                            return (
                                                <PersianDigits>
                                                    <div className="py-3 px-2 text-sm md:text-base whitespace-nowrap flex items-center justify-center transition-colors duration-200 group-hover:text-white">
                                                        {loading ? (<Loader />) : (
                                                            <span className="truncate text-slate-300/90 font-light">
                                                                {showDate as React.ReactNode}
                                                            </span>
                                                        )}
                                                    </div>
                                                </PersianDigits>
                                            );
                                        }}
                                    />
                                );
                            })}
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DynamicTable;
