import flet as ft

def main(page: ft.Page):
    t = ft.Text(value="Hello, world!", color="blue")
    page.controls.append(t)
    page.update()

ft.app(main)