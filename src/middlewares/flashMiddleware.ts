export function flashMiddleware(
  req: { flash: (arg0: string) => any },
  res: { locals: { success_msg: any; error_msg: any } },
  next: () => void,
) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
}
