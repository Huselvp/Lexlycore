package com.iker.Lexly.config.jwt;

import freemarker.template.TemplateException;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactory;

import java.io.IOException;

@Configuration

public class FreeMarkerConfig {
    @Bean
    public freemarker.template.Configuration getFreeMarkerConfiguration() throws TemplateException, IOException {
        FreeMarkerConfigurationFactory factory = new FreeMarkerConfigurationFactory();
        factory.setTemplateLoaderPath("classpath:/templates");
        factory.setDefaultEncoding("UTF-8");
        freemarker.template.Configuration configuration = factory.createConfiguration();
        return configuration;
    }
}

