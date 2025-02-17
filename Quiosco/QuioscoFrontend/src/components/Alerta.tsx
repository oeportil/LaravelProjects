import React from "react";

type Props = {
  children: React.ReactNode;
};

const Alerta = ({ children }: Props) => {
  return (
    <div className="p-3 my-2 font-bold text-center text-white uppercase bg-red-600">
      {children}
    </div>
  );
};

export default Alerta;
