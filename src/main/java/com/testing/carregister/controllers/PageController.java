package com.testing.carregister.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

  @GetMapping("/index")
  public String homePage() {
    return "index";
  }
}
