import usermanagerapi from "../api/usermanagerapi";

const actuatorService = {
    getSystemHealth: () => {
        return usermanagerapi.get("/actuator/health");
    },
    getProcessUpTime: () => {
        return usermanagerapi.get("/actuator/metrics/process.uptime");
    },
    getSystemCPU: () => {
        return usermanagerapi.get("/actuator/metrics/system.cpu.count");
    }
};
export default actuatorService;
