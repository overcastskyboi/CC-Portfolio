import { parametersSchema as z, defineCustomTool } from "@roo-code/types";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export default defineCustomTool({
  name: "oci",
  description: "Executes Oracle Cloud Infrastructure (OCI) CLI commands. The base path and PowerShell execution logic are already handled. Only pass the specific arguments.",
  parameters: z.object({
    args: z.string().describe("The specific OCI arguments to run, e.g., 'os ns get' or 'compute instance list --compartment-id ocid1.compartment...'")
  }),
  async execute({ args }) {
    const ociPath = "C:\\Users\\unkno\\AppData\\Local\\Programs\\Python\\Python311\\Scripts\\oci.exe";
    const command = `& '${ociPath}' ${args}`;

    try {
      const { stdout, stderr } = await execAsync(command, { 
        shell: "powershell.exe",
        maxBuffer: 1024 * 1024 * 10 
      });
      
      if (stderr && !stdout) {
        return `OCI Warning/Error: ${stderr}`;
      }
      return stdout;
    } catch (error) {
      return `Command failed: ${error.message}\n${error.stderr || ""}`;
    }
  }
});