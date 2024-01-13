import classes from "./Header.module.scss";
import {memo} from "react";

const Header = memo(function Header() {
    return (
        <header className={classes.header}>
            <h2>Loan Repayment Calculator</h2>
        </header>
    )
})

export default Header;