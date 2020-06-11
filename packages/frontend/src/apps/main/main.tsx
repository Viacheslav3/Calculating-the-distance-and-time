import React from "react";
import { render } from "react-dom";
import { App } from "../../lib/components/App";

export function main()
{
    const root = document.getElementById("root");
    if(root)
        render(<App/>, root);
}