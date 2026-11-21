import axios from "axios";

// Several places (route guard, navbar store action, ...) ask for /api/user/self during the
// same navigation. Share one in-flight request instead of firing it 3 times. No caching after
// the request settles, so login/logout is always picked up by the next call.
let inflight: Promise<any> | null = null;

export default function fetchUserSelf (): Promise<any> {
    if (inflight) {
        return inflight;
    }
    const request = axios.get("/api/user/self");
    inflight = request;
    const clear = () => {
        if (inflight === request) {
            inflight = null;
        }
    };
    request.then(clear, clear);
    return request;
}
