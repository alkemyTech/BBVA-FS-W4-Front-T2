import { Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const MisCuentas = () => {
  // Obtener las cuentas del estado de Redux
  const accounts = useSelector((state) => state.account.accounts);

  return (
    <div>
      <section>
        <Typography variant="h4">Mis Cuentas</Typography>

        {accounts.map((account) => (
          <article key={account.id} style={{ marginBottom: '20px' }}>
            <Typography variant="h6">Moneda: {account.currency}</Typography>
            <Typography>{account.accountType}</Typography>
            <Typography>$ {account.balance}</Typography>
            {account.cbu && <Typography>CBU: {account.cbu}</Typography>}
          </article>
        ))}

      </section>
    </div>
  );
};

export default MisCuentas;