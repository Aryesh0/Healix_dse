package com.app.module.dashboard;

import com.app.module.appointment.AppointmentRepository;
import com.app.module.billing.BillRepository;
import com.app.module.patient.PatientRepository;
import com.app.module.ward.BedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final BedRepository bedRepository;
    private final BillRepository billRepository;

    public Map<String, Object> getDashboardStats() {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientRepository.countBy());
        stats.put("appointmentsToday", appointmentRepository.countByScheduledAtBetween(startOfDay, endOfDay));
        stats.put("availableBeds", bedRepository.countByStatus("AVAILABLE"));
        stats.put("pendingBills", billRepository.countByPaymentStatus("PENDING"));

        return stats;
    }
}
