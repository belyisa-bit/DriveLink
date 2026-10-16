package br.com.drivelink.lead.ratelimit;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class LeadRateLimiter {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_SECONDS = 60;

    private final ConcurrentHashMap<String, RequestWindow> requests =
        new ConcurrentHashMap<>();

    public boolean isAllowed(String ip) {
        long currentWindow = Instant.now().getEpochSecond()
            / WINDOW_SECONDS;

        AtomicInteger allowed = new AtomicInteger();

        requests.compute(ip, (key, existing) -> {
            if (existing == null
                    || existing.window() != currentWindow) {
                allowed.set(1);
                return new RequestWindow(currentWindow, 1);
            }

            int count = existing.count() + 1;

            allowed.set(count);

            return new RequestWindow(currentWindow, count);
        });

        return allowed.get() <= MAX_REQUESTS;
    }

    private record RequestWindow(long window, int count) {
    }
}