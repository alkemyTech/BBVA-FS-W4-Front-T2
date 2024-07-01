import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const Contactos = ({ handleSelectContact, handleBack }) => {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/contactsList", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setContactList(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleContactSelection = (contact) => {
    handleSelectContact(contact); // Pasamos solo el CBU seleccionado
  };

  return (
    <Box sx={{ mt: 2 }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '20vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 1, justifyContent:"center" }}
          >
            {contactList.map((contact) => (
              <Button
                key={contact.id}
                variant="contained"
                onClick={() => handleContactSelection(contact)}
                sx={{ m: 1 }} 
              >
                {contact.name} - {contact.cbu}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-start" }}>
            <Button variant="outlined" onClick={handleBack}>
              Atrás
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default Contactos;