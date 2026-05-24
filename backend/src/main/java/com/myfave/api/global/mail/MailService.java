package com.myfave.api.global.mail;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

// 메일 양식을 정하는곳
//HTML 형식으로 꾸미려면 여기 바꿔야함
@Service
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    @Async("emailExecutor")
    public void sendPasswordResetCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("[MyFave] 비밀번호 재설정 인증코드");
        message.setText("인증코드: " + code + "\n\n5분 내로 입력해 주세요.");
        mailSender.send(message);
    }

    @Async("emailExecutor")
    public void sendSignUpCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("[MyFave] 회원가입 이메일 인증코드");
        message.setText("인증코드: " + code + "\n\n5분 내로 입력해 주세요.");
        mailSender.send(message);
    }

    @Async("emailExecutor")
    public void sendTempPassword(String to, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject("[마이페이브] 임시 비밀번호 안내");
        message.setText(
                "임시 비밀번호: " + tempPassword + "\n\n"
                        + "로그인 후 즉시 비밀번호를 변경해주세요."
        );
        mailSender.send(message);
    }
}
