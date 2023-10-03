package com.iker.Lexly.service;

import com.iker.Lexly.Entity.DocsTemplate;
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
    public List<DocsTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }
    public Optional<DocsTemplate> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }
    public Optional<DocsTemplate> getTemplateByName(String name) {
        return templateRepository.findByName(name);
    }
    public DocsTemplate createTemplate(DocsTemplate template) {
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
