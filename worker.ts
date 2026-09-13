import * as health from "./functions/api/health";

import * as login from "./functions/api/auth/login";
import * as me from "./functions/api/auth/me";
import * as password from "./functions/api/auth/password";

import * as catalog from "./functions/api/catalog/index";
import * as catalogDownload from "./functions/api/catalog/download";

import * as content from "./functions/api/content/index";

import * as categories from "./functions/api/categories/index";
import * as categoryById from "./functions/api/categories/[id]";

import * as products from "./functions/api/products/index";
import * as productById from "./functions/api/products/[id]";

import * as slider from "./functions/api/slider/index";

import * as contact from "./functions/api/contact/index";
import * as contactById from "./functions/api/contact/[id]";

import * as upload from "./functions/api/upload/index";
import * as uploadSign from "./functions/api/upload/sign";
import * as uploadAuth from "./functions/api/upload/auth";
import * as uploadDestroy from "./functions/api/upload/destroy";


export interface Env {
  ASSETS: Fetcher;
  KV: KVNamespace;

  ENVIRONMENT?: string;

  ADMIN_USERNAME?: string;
  ADMIN_PASSWORD?: string;

  JWT_SECRET?: string;

  IMAGEKIT_PRIVATE_KEY?: string;
  IMAGEKIT_PUBLIC_KEY?: string;
  IMAGEKIT_URL_ENDPOINT?: string;

  DB?: D1Database;

  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;

  FIREBASE_PROJECT_ID?: string;
  FIREBASE_CLIENT_EMAIL?: string;
  FIREBASE_PRIVATE_KEY?: string;
}


type Handler = (
  context: any
) => Promise<Response> | Response;


async function callHandler(
  handler: Handler,
  request: Request,
  env: Env,
  params: Record<string, string> = {}
): Promise<Response> {
  return handler({
    request,
    env,
    params,

    waitUntil: (promise: Promise<any>) => {
      void promise;
    },

    next: () => env.ASSETS.fetch(request),
  });
}


function apiNotFound(path: string): Response {
  return new Response(
    JSON.stringify({
      success: false,
      error: "API endpoint not found",
      path,
    }),
    {
      status: 404,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}


export default {
  async fetch(
    request: Request,
    env: Env
  ): Promise<Response> {

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();


    // =========================
    // HEALTH
    // =========================

    if (path === "/api/health") {

      if (method === "GET" && health.onRequestGet) {
        return callHandler(
          health.onRequestGet,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // AUTH LOGIN
    // =========================

    if (path === "/api/auth/login") {

      if (method === "POST" && login.onRequestPost) {
        return callHandler(
          login.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // AUTH ME
    // =========================

    if (path === "/api/auth/me") {

      if (method === "GET" && me.onRequestGet) {
        return callHandler(
          me.onRequestGet,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // AUTH PASSWORD
    // =========================

    if (path === "/api/auth/password") {

      if (method === "POST" && password.onRequestPost) {
        return callHandler(
          password.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // CATALOG DOWNLOAD
    // =========================

    if (path === "/api/catalog/download") {

      if (method === "GET" && catalogDownload.onRequestGet) {
        return callHandler(
          catalogDownload.onRequestGet,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // CATALOG
    // =========================

    if (path === "/api/catalog") {

      if (method === "GET" && catalog.onRequestGet) {
        return callHandler(
          catalog.onRequestGet,
          request,
          env
        );
      }

      if (method === "PUT" && catalog.onRequestPut) {
        return callHandler(
          catalog.onRequestPut,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // SITE CONTENT
    // =========================

    if (path === "/api/content") {
      if (method === "GET" && content.onRequestGet) {
        return callHandler(content.onRequestGet, request, env);
      }

      if (method === "POST" && content.onRequestPost) {
        return callHandler(content.onRequestPost, request, env);
      }

      return apiNotFound(path);
    }


    // =========================
    // CATEGORIES
    // =========================

    if (path === "/api/categories") {

      if (method === "GET" && categories.onRequestGet) {
        return callHandler(
          categories.onRequestGet,
          request,
          env
        );
      }

      if (method === "POST" && categories.onRequestPost) {
        return callHandler(
          categories.onRequestPost,
          request,
          env
        );
      }

      if (method === "DELETE" && categories.onRequestDelete) {
        return callHandler(
          categories.onRequestDelete,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // CATEGORY BY ID
    // =========================

    if (path.startsWith("/api/categories/")) {

      const id = decodeURIComponent(
        path.substring("/api/categories/".length)
      );

      if (
        id &&
        method === "DELETE" &&
        categoryById.onRequestDelete
      ) {
        return callHandler(
          categoryById.onRequestDelete,
          request,
          env,
          { id }
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // PRODUCTS
    // =========================

    if (path === "/api/products") {

      if (method === "GET" && products.onRequestGet) {
        return callHandler(
          products.onRequestGet,
          request,
          env
        );
      }

      if (method === "POST" && products.onRequestPost) {
        return callHandler(
          products.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // PRODUCT BY ID
    // =========================

    if (path.startsWith("/api/products/")) {

      const id = decodeURIComponent(
        path.substring("/api/products/".length)
      );

      if (id) {

        if (
          method === "GET" &&
          productById.onRequestGet
        ) {
          return callHandler(
            productById.onRequestGet,
            request,
            env,
            { id }
          );
        }


        if (
          method === "PUT" &&
          productById.onRequestPut
        ) {
          return callHandler(
            productById.onRequestPut,
            request,
            env,
            { id }
          );
        }


        if (
          method === "DELETE" &&
          productById.onRequestDelete
        ) {
          return callHandler(
            productById.onRequestDelete,
            request,
            env,
            { id }
          );
        }
      }

      return apiNotFound(path);
    }


    // =========================
    // SLIDER
    // =========================

    if (path === "/api/slider") {

      if (method === "GET" && slider.onRequestGet) {
        return callHandler(
          slider.onRequestGet,
          request,
          env
        );
      }

      if (method === "POST" && slider.onRequestPost) {
        return callHandler(
          slider.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // CONTACT
    // =========================

    if (path === "/api/contact") {

      if (method === "GET" && contact.onRequestGet) {
        return callHandler(
          contact.onRequestGet,
          request,
          env
        );
      }

      if (method === "POST" && contact.onRequestPost) {
        return callHandler(
          contact.onRequestPost,
          request,
          env
        );
      }

      if (method === "PUT" && contact.onRequestPut) {
        return callHandler(
          contact.onRequestPut,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // CONTACT BY ID
    // =========================

    if (path.startsWith("/api/contact/")) {

      const id = decodeURIComponent(
        path.substring("/api/contact/".length)
      );

      if (id) {

        if (
          method === "PUT" &&
          contactById.onRequestPut
        ) {
          return callHandler(
            contactById.onRequestPut,
            request,
            env,
            { id }
          );
        }


        if (
          method === "DELETE" &&
          contactById.onRequestDelete
        ) {
          return callHandler(
            contactById.onRequestDelete,
            request,
            env,
            { id }
          );
        }
      }

      return apiNotFound(path);
    }


    // =========================
    // UPLOAD
    // =========================

    if (path === "/api/upload") {

      if (
        method === "POST" &&
        upload.onRequestPost
      ) {
        return callHandler(
          upload.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // UPLOAD SIGN
    // =========================

    if (path === "/api/upload/sign") {

      if (
        method === "POST" &&
        uploadSign.onRequestPost
      ) {
        return callHandler(
          uploadSign.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // UPLOAD AUTH
    // =========================

    if (path === "/api/upload/auth") {

      if (
        method === "POST" &&
        uploadAuth.onRequestPost
      ) {
        return callHandler(
          uploadAuth.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // UPLOAD DESTROY
    // =========================

    if (path === "/api/upload/destroy") {

      if (
        method === "POST" &&
        uploadDestroy.onRequestPost
      ) {
        return callHandler(
          uploadDestroy.onRequestPost,
          request,
          env
        );
      }

      return apiNotFound(path);
    }


    // =========================
    // STATIC WEBSITE
    // =========================

    return env.ASSETS.fetch(request);
  },
};
