package com.iker.Lexly.service;

import com.iker.Lexly.repository.TemplateRepository;
import freemarker.cache.ClassTemplateLoader;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TemplateService {
    private final Configuration freemarkerConfig;
    private final TemplateRepository templateRepository;
@Autowired
    public TemplateService(@Qualifier("freeMarkerConfiguration") Configuration freemarkerConfig, TemplateRepository templateRepository) {
        this.freemarkerConfig = freemarkerConfig;
        this.templateRepository=templateRepository;
    }


    public List<Template> getAllTemplates() {
        return templateRepository.findAll();
    }

    public Optional<Template> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }

    public Optional<Template> getTemplateByName(String name) {
        return templateRepository.findByName(name);
    }

    public Template createTemplate(Template template) {
        return templateRepository.save(template);
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
