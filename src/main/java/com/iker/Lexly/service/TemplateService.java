package com.iker.Lexly.service;

import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.Map;
@Service
public class TemplateService {
    private final Configuration freemarkerConfig;

    public TemplateService(@Qualifier("freeMarkerConfiguration") Configuration freemarkerConfig) {
        this.freemarkerConfig = freemarkerConfig;
    }

    public String fetchTemplateContent(String templateName) throws IOException, TemplateException {
        ClassTemplateLoader templateLoader = new ClassTemplateLoader(getClass(), "/templates");
        freemarkerConfig.setTemplateLoader(templateLoader);
        Template template = freemarkerConfig.getTemplate(templateName + ".ftl");

        Map<String, Object> model = new HashMap<>();
        StringWriter writer = new StringWriter();
        template.process(model, writer);
        return writer.toString();
    }
}
