import React from "react";

const Fileinput = ({
  name,
  label,
  onChange,
  placeholder = "Choose a file or drop it here...",
  preview,
  accept = "choose",
  className = "custom-class",
  id,
  required,
  selectedFile,
  register,
}) => {
  return (
    <div>
      <div className="filegroup">
        <label>
          {label && (
            <span
              style={{
                fontSize: 0.87 + "rem",
                justifyContent: "space-between",
                width: 100 + "%",
              }}
              className="file-name d-flex  h-full inline-flex items-center text-slate-600 dark:text-slate-400 text-lg font-medium mb-1"
            >
              {label}
            </span>
          )}

          {!required &&
            (register ? (
              <input
                type="file"
                {...register(name)}
                onChange={onChange}
                className="bg-red-400 w-full hidden"
                name={name}
                id={id}
                accept={accept}
                multiple={false}
                placeholder={placeholder}
              />
            ) : (
              <input
                type="file"
                onChange={onChange}
                className="bg-red-400 w-full hidden"
                name={name}
                id={id}
                accept={accept}
                multiple={false}
                placeholder={placeholder}
              />
            ))}
          <div
            className={`w-full file-control cursor-pointer pl-0 border-none flex items-center ${className}`}
          >
            {!selectedFile ? (
              <div className="border-2 border-dashed rounded-md w-full h-full p-4 flex justify-center items-center">
                <span className="text-gray-500 font-semibold text-center">
                  {placeholder}
                </span>
              </div>
            ) : (
              preview &&
              selectedFile && (
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : ""}
                  className="w-full  h-full block object-contain rounded-md my-2 border border-slate-200"
                  alt={selectedFile?.name}
                />
              )
            )}
          </div>
        </label>
      </div>
    </div>
  );
};

export default Fileinput;
