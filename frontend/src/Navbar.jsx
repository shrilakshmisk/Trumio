import React from 'react';
import { Tabs, Tab, Paper, IconButton, styled } from '@mui/material';
import Image from 'next/image';
import Link from "next/link";


const CustomPaper = styled(Paper)({
	position:"sticky",
	zIndex:"100",
  display: "flex",
  backgroundColor: "#FFFFFF",
  fontSize: "20px",
  fontFamily: "'Montserrat'",
  alignItems: "center",
  gap: "10px",
  paddingLeft:"10px",
  marginBottom:"10px",
  width: "100%",
  height: "75px",
  top:"0",
  boxShadow: "0px 0px 5px 0px #D1D1D1",
  borderRadius: "10px",
  boxSizing:"border-box"
});

const CustomIconButton = styled(IconButton)({
  marginRight: "10px",
});

const Navbar = ({ currentTab, onTabChange }) => {
  return (
    <CustomPaper elevation={1}>
      {/* Use the img element for the company logo */}
      <Link href="/client/dashboard" onClick={() => {onTabChange(undefined, "Dashboard")}}><Image src="/assets/logo.jpg" alt="Company Logo" width="150" height="40" borderRadius="50%" /></Link>

      <p>v0.0.13</p>

      
        {
        ["Dashboard", "Chat", "Apps"].includes(currentTab) ?
        (<Tabs value={currentTab} onChange={onTabChange} sx={{ flexGrow: 1 }}>
			<Tab label="Dashboard" value="Dashboard" />
			<Tab component="a" href={`${process.env.NEXT_PUBLIC_ROCKETCHAT}`} label="Chat" value="Chat" />
			<Tab label="Apps" value="Apps" />
        </Tabs>) :
        (<Tabs value={currentTab} onChange={onTabChange} sx={{ flexGrow: 1 }}>
        	<Tab component="a" href="/client/dashboard" label="Dashboard" value="Dashboard" />
			<Tab component="a" href={`${process.env.NEXT_PUBLIC_ROCKETCHAT}`} label="Chat" value="Chat" />
        	<Tab component="a" href="/client/dashboard?tab=Apps" label="Apps" value="Apps" />
        </Tabs>)}
    </CustomPaper>
  );
};

export default Navbar;
